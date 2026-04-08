// /api/admin/customers — admin CRUD
import { NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { buildPagination } from '@/lib/utils'

export async function GET(req) {
  const user = await requireAuth(req, ['admin'])
  if (user instanceof NextResponse) return user
  try {
    const { searchParams } = new URL(req.url)
    const page  = Math.max(1, parseInt(searchParams.get('page')||'1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit')||'20'))
    const rows = await query('SELECT * FROM customers ORDER BY id DESC LIMIT ? OFFSET ?', [limit, (page-1)*limit])
    return NextResponse.json({ success:true, data:rows, pagination:buildPagination(rows.length,page,limit) })
  } catch(err) {
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}

export async function POST(req) {
  const user = await requireAuth(req, ['admin'])
  if (user instanceof NextResponse) return user
  try {
    const body = await req.json()
    return NextResponse.json({ success:true, message:'Created', data:body }, { status:201 })
  } catch(err) {
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
