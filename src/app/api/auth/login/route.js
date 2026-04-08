// ============================================================
// POST /api/auth/login — validate credentials, return JWT cookie
// ============================================================
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Both fields are required
    if (!email || !password)
      return NextResponse.json({ success:false, message:'Email and password required' }, { status:400 })

    // Fetch user with role name via JOIN — one query avoids N+1
    const rows = await query(
      `SELECT u.*, r.name AS role
       FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.email = ? AND u.is_active = 1 LIMIT 1`,
      [email.toLowerCase().trim()]
    )
    const user = rows[0]

    // bcrypt.compare is constant-time — safe against timing attacks
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return NextResponse.json({ success:false, message:'Invalid email or password' }, { status:401 })

    // Record last_login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])

    // Sign a 7-day JWT with minimal claims
    const token = await signToken({ userId:user.id, email:user.email, role:user.role })

    // Never expose password_hash in the response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: { id:user.id, first_name:user.first_name, last_name:user.last_name, email:user.email, role:user.role, avatar_url:user.avatar_url },
    })
    return setAuthCookie(response, token)
  } catch (err) {
    console.error('[POST /api/auth/login]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
