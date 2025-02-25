import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`http://localhost:3100/assessmentFrameworks/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Fetch framework error:', error)
    return NextResponse.json(null, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const res = await fetch(`http://localhost:3100/assessmentFrameworks/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Update framework error:', error)
    return NextResponse.json(null, { status: 500 })
  }
} 