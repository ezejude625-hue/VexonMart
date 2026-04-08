// GET /api/orders/:id — get order detail
// PATCH /api/orders/:id — update status (admin)
import { NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req, { params }) {
  const user = await requireAuth(req)
  if (user instanceof NextResponse) return user
  try {
    const [order] = await query('SELECT * FROM orders WHERE order_number=? LIMIT 1', [params.id])
    if (!order) return NextResponse.json({ success:false, message:'Order not found' }, { status:404 })
    // Users can only see their own orders; admins see all
    if (user.role!=='admin' && order.user_id!==user.userId)
      return NextResponse.json({ success:false, message:'Forbidden' }, { status:403 })
    const items = await query('SELECT * FROM order_items WHERE order_id=?', [order.id])
    return NextResponse.json({ success:true, data:{ ...order, items } })
  } catch(err) {
    console.error('[GET /api/orders/:id]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

export async function PATCH(req, { params }) {
  const user = await requireAuth(req, ['admin'])
  if (user instanceof NextResponse) return user
  try {
    const { status, payment_status } = await req.json()
    const [order] = await query('SELECT id FROM orders WHERE order_number=? LIMIT 1', [params.id])
    if (!order) return NextResponse.json({ success:false, message:'Order not found' }, { status:404 })
    const sets=[]; const vals=[]
    if (status)         { sets.push('status=?');         vals.push(status)         }
    if (payment_status) { sets.push('payment_status=?'); vals.push(payment_status) }
    if (!sets.length)   return NextResponse.json({ success:false, message:'Nothing to update' }, { status:400 })
    vals.push(order.id)
    await execute(`UPDATE orders SET ${sets.join(',')},updated_at=NOW() WHERE id=?`, vals)
    return NextResponse.json({ success:true, message:'Order updated' })
  } catch(err) {
    console.error('[PATCH /api/orders/:id]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
