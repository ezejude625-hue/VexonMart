// GET /api/admin/stats — dashboard KPI data
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req) {
  const user = await requireAuth(req, ['admin','support'])
  if (user instanceof NextResponse) return user
  try {
    const [revenue]   = await query("SELECT COALESCE(SUM(total_amount),0) AS total, COUNT(*) AS orders FROM orders WHERE payment_status='paid' AND created_at >= DATE_SUB(NOW(),INTERVAL 30 DAY)")
    const [lastMonth] = await query("SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE payment_status='paid' AND created_at BETWEEN DATE_SUB(NOW(),INTERVAL 60 DAY) AND DATE_SUB(NOW(),INTERVAL 30 DAY)")
    const [customers] = await query("SELECT COUNT(*) AS total FROM users WHERE role_id=2 AND is_active=1")
    const [products]  = await query("SELECT COUNT(*) AS total FROM products WHERE status='active'")
    const revenueChange = lastMonth.total > 0 ? Math.round(((revenue.total - lastMonth.total)/lastMonth.total)*100) : 100
    return NextResponse.json({ success:true, data: { total_revenue:revenue.total, revenue_change:revenueChange, total_orders:revenue.orders, total_customers:customers.total, total_products:products.total } })
  } catch(err) {
    console.error('[GET /api/admin/stats]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
