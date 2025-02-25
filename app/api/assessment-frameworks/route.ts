import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const res = await fetch('http://localhost:3100/assessmentFrameworks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    })
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/assessment-frameworks:', error)
    // 返回空数组而不是错误状态
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch('http://localhost:3100/assessmentFrameworks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/assessment-frameworks:', error)
    return NextResponse.json({ error: 'Failed to create framework' }, { status: 500 })
  }
} 