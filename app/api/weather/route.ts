import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.OPENWEATHER_KEY
  const lat = process.env.PULSE_LAT
  const lon = process.env.PULSE_LON

  if (!key || !lat || !lon) return NextResponse.json({ error: 'missing env' }, { status: 500 })

  const r = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${key}`,
    { cache: 'no-store' }
  )
  const w = await r.json()

  return NextResponse.json({
    city: w.name,
    desc: w.weather?.[0]?.description || '',
    icon: w.weather?.[0]?.main || '',
    temp: Math.round(w.main?.temp),
    feels: Math.round(w.main?.feels_like),
    min: Math.round(w.main?.temp_min),
    max: Math.round(w.main?.temp_max)
  })
}