// GET /api/orders — list user's orders
// POST /api/orders — place a new order
import { NextResponse } from 'next/server'
import { query, execute, transaction } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { generateOrderNumber, applyCoupon } from '@/lib/utils'

export async function GET(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const orders = await query(
      `SELECT o.*, GROUP_CONCAT(oi.product_name SEPARATOR ', ') AS products_summary
       FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id
       WHERE o.user_id=? GROUP BY o.id ORDER BY o.created_at DESC`,
      [user.userId]
    )
    return NextResponse.json({ success:true, data:orders })
  } catch(err) {
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

export async function POST(req) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const { coupon_code, address_id, payment_method='stripe' } = await req.json()

    // Fetch cart items
    const [cart] = await query('SELECT id FROM cart WHERE user_id=? LIMIT 1', [user.userId])
    if (!cart) return NextResponse.json({ success:false, message:'Cart is empty' }, { status:400 })
    const cartItems = await query(
      `SELECT ci.quantity, p.id AS product_id, p.name, p.price, p.sale_price, p.thumbnail_url, p.stock
       FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.cart_id=?`,
      [cart.id]
    )
    if (!cartItems.length) return NextResponse.json({ success:false, message:'Cart is empty' }, { status:400 })

    const subtotal = cartItems.reduce((s,i) => s + (i.sale_price||i.price)*i.quantity, 0)

    // Validate and apply coupon
    let discountAmount = 0, couponId = null
    if (coupon_code) {
      const [coupon] = await query(
        `SELECT * FROM coupons WHERE code=? AND is_active=1 AND (expires_at IS NULL OR expires_at > NOW()) AND (usage_limit IS NULL OR used_count < usage_limit) LIMIT 1`,
        [coupon_code.toUpperCase()]
      )
      if (coupon && subtotal >= (coupon.min_order_amount||0)) {
        const { discount } = applyCoupon(subtotal, coupon.discount_type, coupon.discount_value, coupon.max_discount)
        discountAmount = discount; couponId = coupon.id
      }
    }

    const taxAmount      = (subtotal - discountAmount) * 0.075
    const shippingAmount = subtotal >= 100 ? 0 : 9.99
    const totalAmount    = subtotal - discountAmount + taxAmount + shippingAmount
    const orderNumber    = generateOrderNumber()

    await transaction(async(conn) => {
      // Create order record
      const [orderResult] = await conn.execute(
        `INSERT INTO orders (order_number,user_id,coupon_id,address_id,subtotal,discount_amount,tax_amount,shipping_amount,total_amount,status,payment_status,payment_method) VALUES (?,?,?,?,?,?,?,?,?,'pending','unpaid',?)`,
        [orderNumber, user.userId, couponId, address_id||null, subtotal, discountAmount, taxAmount, shippingAmount, totalAmount, payment_method]
      )
      const orderId = orderResult.insertId

      // Insert each line item
      for (const item of cartItems) {
        const unitPrice = item.sale_price || item.price
        await conn.execute(
          'INSERT INTO order_items (order_id,product_id,product_name,product_image,quantity,unit_price,total_price) VALUES (?,?,?,?,?,?,?)',
          [orderId, item.product_id, item.name, item.thumbnail_url, item.quantity, unitPrice, unitPrice*item.quantity]
        )
        // Decrement physical stock (digital products have stock=-1)
        if (item.stock !== -1)
          await conn.execute('UPDATE products SET stock=stock-? WHERE id=?', [item.quantity, item.product_id])
      }

      // Increment coupon usage
      if (couponId) await conn.execute('UPDATE coupons SET used_count=used_count+1 WHERE id=?', [couponId])

      // Clear the cart
      await conn.execute('DELETE FROM cart_items WHERE cart_id=?', [cart.id])
    })

    return NextResponse.json({ success:true, message:'Order placed', data:{ order_number:orderNumber } }, { status:201 })
  } catch(err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
