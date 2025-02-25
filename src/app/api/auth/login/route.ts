import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log(`API route: Login attempt with username=${username}`);

    // 调用 json-server 验证用户
    const response = await fetch('http://localhost:3100/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log(`API route: Response status from json-server: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API route: Error response from json-server: ${errorText}`);
      
      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch (e) {
        errorObj = { error: '认证失败' };
      }
      
      return NextResponse.json(
        { error: errorObj.error || '认证失败' },
        { status: response.status }
      );
    }

    const user = await response.json();
    console.log(`API route: User authenticated: ${user.name}`);
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('API route: Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 