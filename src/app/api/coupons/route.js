// POST /api/coupons — validate a coupon code during checkout
import { NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { applyCoupon } from '@/lib/utils'

export async function POST(req) {
  try {
    const { code, cart_total } = await req.json()
    if (!code || !cart_total) return NextResponse.json({ success:false, message:'code and cart_total required' }, { status:400 })

    // Find active, non-expired coupon with remaining usage
    const [coupon] = await query(
      `SELECT * FROM coupons WHERE code=? AND is_active=1 AND (expires_at IS NULL OR expires_at>NOW()) AND (usage_limit IS NULL OR used_count<usage_limit) LIMIT 1`,
      [code.toUpperCase().trim()]
    )
    if (!coupon) return NextResponse.json({ success:false, message:'Coupon code is invalid or expired' }, { status:404 })
    if (cart_total < (coupon.min_order_amount||0))
      return NextResponse.json({ success:false, message:`Minimum order of $${coupon.min_order_amount} required for this coupon` }, { status:400 })

    const { discount, finalPrice } = applyCoupon(cart_total, coupon.discount_type, coupon.discount_value, coupon.max_discount)

    return NextResponse.json({
      success: true,
      data: { code:coupon.code, discount_type:coupon.discount_type, discount_value:coupon.discount_value, discount_amount:discount, original_total:cart_total, final_total:finalPrice },
    })
  } catch(err) {
    console.error('[POST /api/coupons]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
