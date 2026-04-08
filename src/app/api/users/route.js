// GET/PATCH/DELETE /api/users — current user's profile
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query, execute } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { isValidEmail, isStrongPassword } from '@/lib/utils'

export async function GET(req) {
  const caller = await requireAuth(req)
  if (caller instanceof NextResponse) return caller
  try {
    const [user] = await query('SELECT id,first_name,last_name,email,phone,avatar_url,email_verified,is_active,last_login,created_at FROM users WHERE id=? LIMIT 1', [caller.userId])
    if (!user) return NextResponse.json({ success:false, message:'User not found' }, { status:404 })
    return NextResponse.json({ success:true, data:user })
  } catch(err) { return NextResponse.json({ success:false, message:'Server error' }, { status:500 }) }
}

export async function PATCH(req) {
  const caller = await requireAuth(req)
  if (caller instanceof NextResponse) return caller
  try {
    const body = await req.json()
    const allowed = ['first_name','last_name','phone','avatar_url']
    const sets=[]; const vals=[]
    for (const k of allowed) if (k in body && body[k]!==undefined) { sets.push(`${k}=?`); vals.push(body[k]) }
    if (body.password) {
      if (!isStrongPassword(body.password)) return NextResponse.json({ success:false, message:'Weak password' }, { status:400 })
      sets.push('password_hash=?'); vals.push(await bcrypt.hash(body.password,12))
    }
    if (!sets.length) return NextResponse.json({ success:false, message:'Nothing to update' }, { status:400 })
    vals.push(caller.userId)
    await execute(`UPDATE users SET ${sets.join(',')},updated_at=NOW() WHERE id=?`, vals)
    return NextResponse.json({ success:true, message:'Profile updated' })
  } catch(err) { return NextResponse.json({ success:false, message:'Server error' }, { status:500 }) }
}

export async function DELETE(req) {
  const caller = await requireAuth(req)
  if (caller instanceof NextResponse) return caller
  try {
    await execute('UPDATE users SET is_active=0 WHERE id=?', [caller.userId])
    const res = NextResponse.json({ success:true, message:'Account deactivated' })
    res.cookies.set('vexon_auth','',{maxAge:0,path:'/'})
    return res
  } catch(err) { return NextResponse.json({ success:false, message:'Server error' }, { status:500 }) }
}
