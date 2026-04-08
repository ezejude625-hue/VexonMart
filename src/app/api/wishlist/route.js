// GET/POST/DELETE /api/wishlist
import { NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const items = await query(
      `SELECT w.id,w.added_at,p.id AS product_id,p.name,p.price,p.sale_price,p.thumbnail_url,p.avg_rating,p.stock FROM wishlist w JOIN products p ON p.id=w.product_id WHERE w.user_id=? ORDER BY w.added_at DESC`,
      [user.userId]
    )
    return NextResponse.json({ success:true, data:items })
  } catch(err) { return NextResponse.json({ success:false, message:'Server error' }, { status:500 }) }
}

export async function POST(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const { product_id } = await req.json()
    if (!product_id) return NextResponse.json({ success:false, message:'product_id required' }, { status:400 })
    await execute('INSERT IGNORE INTO wishlist (user_id,product_id) VALUES (?,?)', [user.userId, product_id])
    return NextResponse.json({ success:true, message:'Added to wishlist' })
  } catch(err) { return NextResponse.json({ success:false, message:'Server error' }, { status:500 }) }
}

export async function DELETE(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const product_id = new URL(req.url).searchParams.get('product_id')
    if (!product_id) return NextResponse.json({ success:false, message:'product_id required' }, { status:400 })
    await execute('DELETE FROM wishlist WHERE user_id=? AND product_id=?', [user.userId, product_id])
    return NextResponse.json({ success:true, message:'Removed from wishlist' })
  } catch(err) { return NextResponse.json({ success:false, message:'Server error' }, { status:500 }) }
}
