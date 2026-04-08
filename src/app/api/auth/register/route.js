// POST /api/auth/register — create account + auto-login
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query, execute } from '@/lib/db'
import { signToken, setAuthCookie } from '@/lib/auth'
import { isValidEmail, isStrongPassword } from '@/lib/utils'

export async function POST(req) {
  try {
    const { first_name, last_name, email, password } = await req.json()

    // Validate all required fields
    if (!first_name?.trim() || !last_name?.trim())
      return NextResponse.json({ success:false, message:'First and last name are required' }, { status:400 })
    if (!isValidEmail(email))
      return NextResponse.json({ success:false, message:'Invalid email address' }, { status:400 })
    if (!isStrongPassword(password))
      return NextResponse.json({ success:false, message:'Password must be 8+ chars with uppercase, lowercase, and a number' }, { status:400 })

    // Check for duplicate — unique constraint in DB would also catch this
    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase().trim()])
    if (existing[0])
      return NextResponse.json({ success:false, message:'An account with this email already exists' }, { status:409 })

    // Hash with 12 rounds — strong security with acceptable latency (~300ms)
    const password_hash = await bcrypt.hash(password, 12)

    // Insert as customer (role_id=2)
    const result = await execute(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash, email_verified, is_active) VALUES (2,?,?,?,?,0,1)',
      [first_name.trim(), last_name.trim(), email.toLowerCase().trim(), password_hash]
    )

    // Auto-login: sign token so user doesn't need to log in separately
    const token    = await signToken({ userId:result.insertId, email:email.toLowerCase().trim(), role:'customer' })
    const response = NextResponse.json({
      success: true, message: 'Account created successfully',
      data: { id:result.insertId, first_name:first_name.trim(), last_name:last_name.trim(), email:email.toLowerCase().trim(), role:'customer' },
    }, { status:201 })
    return setAuthCookie(response, token)
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ success:false, message:'Internal server error' }, { status:500 })
  }
}
