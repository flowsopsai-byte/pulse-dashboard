import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PIN = process.env.PULSE_PIN || '1234'

export function middleware(request: NextRequest) {
  const pin = request.cookies.get('pulse-pin')?.value
  const path = request.nextUrl.pathname

  if (pin === PIN) return NextResponse.next()

  if (path === '/pin' || path.startsWith('/api/pin')) {
    return NextResponse.next()
  }

  if (path.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = request.nextUrl.clone()
  url.pathname = '/pin'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|manifest.json|icon-).*)']
}