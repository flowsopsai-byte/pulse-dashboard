import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const PIN = process.env.PULSE_PIN || '1234'

export async function POST(request: Request) {
  const { pin } = await request.json()
  
  if (pin === PIN) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('pulse-pin', PIN, { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 30
    })
    return response
  }
  
  return NextResponse.json({ ok: false })
}