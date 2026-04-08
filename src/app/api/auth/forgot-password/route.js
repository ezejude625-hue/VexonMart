// POST /api/auth/forgot-password — generate reset token
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { query, execute } from '@/lib/db'
export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success:false, message:'Email required' }, { status:400 })
    const rows = await query('SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1', [email.toLowerCase().trim()])
    if (rows[0]) {
      const token   = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 30*60*1000)
      await execute('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?', [token, expires, rows[0].id])
      console.info(`[forgot-password] Reset link for ${email}: /auth/reset?token=${token}`)
    }
    return NextResponse.json({ success:true, message:'If an account exists, a reset link has been sent.' })
  } catch(err) {
    console.error('[POST /api/auth/forgot-password]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
