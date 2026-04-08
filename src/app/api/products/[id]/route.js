// GET /api/products/:id — fetch product + reviews
// PATCH /api/products/:id — update (owner/admin)
// DELETE /api/products/:id — archive (owner/admin)
import { NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const id   = parseInt(params.id)
    const rows = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              CONCAT(u.first_name,' ',u.last_name) AS seller_name, u.email AS seller_email
       FROM products p LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN users u ON u.id=p.seller_id
       WHERE p.id = ? AND p.status='active' LIMIT 1`,
      [id]
    )
    if (!rows[0]) return NextResponse.json({ success:false, message:'Product not found' }, { status:404 })
    const product = rows[0]
    // Parse JSON columns stored as strings in MySQL
    if (typeof product.images==='string') product.images = JSON.parse(product.images||'[]')
    if (typeof product.tags  ==='string') product.tags   = JSON.parse(product.tags  ||'[]')
    const reviews = await query(
      `SELECT r.id,r.rating,r.title,r.body,r.is_verified,r.created_at,CONCAT(u.first_name,' ',LEFT(u.last_name,1),'.') AS reviewer_name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? AND r.is_approved=1 ORDER BY r.created_at DESC LIMIT 10`,
      [id]
    )
    return NextResponse.json({ success:true, data:{ ...product, reviews } })
  } catch(err) {
    console.error('[GET /api/products/:id]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

export async function PATCH(req, { params }) {
  const user = await requireAuth(req, ['admin','vendor'])
  if (user instanceof NextResponse) return user
  try {
    const id   = parseInt(params.id)
    const body = await req.json()
    const [product] = await query('SELECT seller_id FROM products WHERE id=? LIMIT 1', [id])
    if (!product) return NextResponse.json({ success:false, message:'Not found' }, { status:404 })
    if (user.role!=='admin' && product.seller_id!==user.userId)
      return NextResponse.json({ success:false, message:'Forbidden' }, { status:403 })
    const allowed = ['name','slug','description','short_desc','price','sale_price','thumbnail_url','images','tags','stock','status','is_featured','category_id','meta_title','meta_desc']
    const sets=[]; const vals=[]
    for (const k of allowed) if (k in body) { sets.push(`${k}=?`); vals.push(Array.isArray(body[k])?JSON.stringify(body[k]):body[k]) }
    if (!sets.length) return NextResponse.json({ success:false, message:'No valid fields' }, { status:400 })
    vals.push(id)
    await execute(`UPDATE products SET ${sets.join(',')},updated_at=NOW() WHERE id=?`, vals)
    return NextResponse.json({ success:true, message:'Product updated' })
  } catch(err) {
    console.error('[PATCH /api/products/:id]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

export async function DELETE(req, { params }) {
  const user = await requireAuth(req, ['admin','vendor'])
  if (user instanceof NextResponse) return user
  try {
    const id = parseInt(params.id)
    const [product] = await query('SELECT seller_id FROM products WHERE id=? LIMIT 1', [id])
    if (!product) return NextResponse.json({ success:false, message:'Not found' }, { status:404 })
    if (user.role!=='admin' && product.seller_id!==user.userId)
      return NextResponse.json({ success:false, message:'Forbidden' }, { status:403 })
    // Soft-delete: archive instead of hard delete
    await execute("UPDATE products SET status='archived',updated_at=NOW() WHERE id=?", [id])
    return NextResponse.json({ success:true, message:'Product archived' })
  } catch(err) {
    console.error('[DELETE /api/products/:id]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
