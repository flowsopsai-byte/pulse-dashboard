import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PIN = process.env.PULSE_PIN || '1234'

export function middleware(request: NextRequest) {
  const pin = request.cookies.get('pulse-pin')?.value
  
  if (pin === PIN) return NextResponse.next()
  
  const url = request.nextUrl.clone()
  if (url.pathname === '/pin') return NextResponse.next()
  
  url.pathname = '/pin'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api|manifest.json|icon-).*)']
}