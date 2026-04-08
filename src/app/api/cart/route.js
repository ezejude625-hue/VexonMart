// GET/POST/PUT/DELETE /api/cart — persistent cart for logged-in users
import { NextResponse } from 'next/server'
import { query, execute, transaction } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

// GET: fetch the user's cart with product details
export async function GET(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    // Ensure the user has a cart row, create one if not
    const [cart] = await query('SELECT id FROM cart WHERE user_id=? LIMIT 1', [user.userId])
    if (!cart) {
      await execute('INSERT IGNORE INTO cart (user_id) VALUES (?)', [user.userId])
      return NextResponse.json({ success:true, data:{ items:[], subtotal:0, item_count:0 } })
    }
    const items = await query(
      `SELECT ci.id,ci.quantity,p.id AS product_id,p.name,p.price,p.sale_price,p.thumbnail_url,p.product_type,p.stock
       FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.cart_id=?`,
      [cart.id]
    )
    const subtotal   = items.reduce((s,i) => s + (i.sale_price||i.price)*i.quantity, 0)
    const item_count = items.reduce((s,i) => s + i.quantity, 0)
    return NextResponse.json({ success:true, data:{ items, subtotal, item_count } })
  } catch(err) {
    console.error('[GET /api/cart]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

// POST: add a product to cart
export async function POST(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const { product_id, quantity=1 } = await req.json()
    if (!product_id) return NextResponse.json({ success:false, message:'product_id required' }, { status:400 })
    await transaction(async(conn) => {
      // Create cart if not exists
      await conn.execute('INSERT IGNORE INTO cart (user_id) VALUES (?)', [user.userId])
      const [[cart]] = await conn.execute('SELECT id FROM cart WHERE user_id=? LIMIT 1', [user.userId])
      // Upsert: if product already in cart, add to quantity
      await conn.execute('INSERT INTO cart_items (cart_id,product_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=quantity+?', [cart.id, product_id, quantity, quantity])
    })
    return NextResponse.json({ success:true, message:'Added to cart' })
  } catch(err) {
    console.error('[POST /api/cart]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

// PUT: update quantity of a cart item
export async function PUT(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const { product_id, quantity } = await req.json()
    if (!product_id || quantity < 1) return NextResponse.json({ success:false, message:'Valid product_id and quantity required' }, { status:400 })
    const [cart] = await query('SELECT id FROM cart WHERE user_id=? LIMIT 1', [user.userId])
    if (!cart) return NextResponse.json({ success:false, message:'Cart not found' }, { status:404 })
    await execute('UPDATE cart_items SET quantity=? WHERE cart_id=? AND product_id=?', [quantity, cart.id, product_id])
    return NextResponse.json({ success:true, message:'Cart updated' })
  } catch(err) {
    console.error('[PUT /api/cart]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

// DELETE: remove a product from cart
export async function DELETE(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const { searchParams } = new URL(req.url)
    const product_id = searchParams.get('product_id')
    if (!product_id) return NextResponse.json({ success:false, message:'product_id required' }, { status:400 })
    const [cart] = await query('SELECT id FROM cart WHERE user_id=? LIMIT 1', [user.userId])
    if (!cart) return NextResponse.json({ success:false, message:'Cart not found' }, { status:404 })
    await execute('DELETE FROM cart_items WHERE cart_id=? AND product_id=?', [cart.id, product_id])
    return NextResponse.json({ success:true, message:'Item removed' })
  } catch(err) {
    console.error('[DELETE /api/cart]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
