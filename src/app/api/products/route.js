// GET /api/products — list & search products
// POST /api/products — create product (vendor/admin)
import { NextResponse } from 'next/server'
import { query, paginate, execute } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { buildPagination, slugify } from '@/lib/utils'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const page     = Math.max(1, parseInt(searchParams.get('page')    ||'1'))
  const limit    = Math.min(50,parseInt(searchParams.get('limit')   ||'20'))
  const q        = searchParams.get('q')       ||''
  const category = searchParams.get('category')||''
  const filter   = searchParams.get('filter')  ||''
  const sort     = searchParams.get('sort')    ||'newest'

  try {
    const conditions = ["p.status = 'active'"]
    const params     = []

    // Full-text search across name, description, tags
    if (q) { conditions.push('MATCH(p.name,p.description,p.tags) AGAINST(? IN BOOLEAN MODE)'); params.push(q+'*') }
    if (category) { conditions.push('c.slug = ?'); params.push(category) }
    if (filter==='sale')    conditions.push('p.sale_price IS NOT NULL AND p.sale_price < p.price')
    if (filter==='new')     conditions.push('p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
    if (filter==='popular') conditions.push('p.total_sales > 10')

    const where    = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderMap = { price_asc:'p.price ASC', price_desc:'p.price DESC', rating:'p.avg_rating DESC', popular:'p.total_sales DESC', newest:'p.created_at DESC' }
    const orderBy  = orderMap[sort] || 'p.created_at DESC'

    const baseSql = `SELECT p.id,p.name,p.slug,p.price,p.sale_price,p.thumbnail_url,p.product_type,p.stock,p.avg_rating,p.review_count,p.total_sales,p.is_featured,c.name AS category_name,c.slug AS category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id ${where} ORDER BY ${orderBy}`
    const { data, total } = await paginate(baseSql, params, page, limit)

    return NextResponse.json({ success:true, data, pagination:buildPagination(total,page,limit) })
  } catch(err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

export async function POST(req) {
  const user = await requireAuth(req, ['admin','vendor'])
  if (user instanceof NextResponse) return user
  try {
    const body = await req.json()
    const { name, price, description, short_desc, category_id, product_type='physical', stock=1, sku, status='draft', is_featured=false, sale_price, thumbnail_url } = body
    if (!name || !price) return NextResponse.json({ success:false, message:'Name and price are required' }, { status:400 })
    const slug = slugify(name) + '-' + Date.now()
    const result = await execute(
      'INSERT INTO products (seller_id,category_id,name,slug,description,short_desc,price,sale_price,thumbnail_url,product_type,stock,sku,status,is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [user.userId, category_id||null, name, slug, description||null, short_desc||null, price, sale_price||null, thumbnail_url||null, product_type, stock, sku||null, status, is_featured?1:0]
    )
    return NextResponse.json({ success:true, message:'Product created', data:{ id:result.insertId, slug } }, { status:201 })
  } catch(err) {
    console.error('[POST /api/products]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
