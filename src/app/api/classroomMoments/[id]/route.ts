import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 尝试直接访问 json-server 的根路径
    const response = await fetch(`http://localhost:3100/moments/${params.id}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch from json-server: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch classroom moment with id ${params.id}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in classroom moments API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 