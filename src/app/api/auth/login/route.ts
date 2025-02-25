import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log(`Login attempt: username=${username}`);

    // 调用 json-server 验证用户
    const response = await fetch('http://localhost:3100/users', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch users: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to authenticate' },
        { status: 500 }
      );
    }

    const users = await response.json();
    console.log(`Found ${users.length} users`);

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (!user) {
      console.log('User not found or password incorrect');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log(`User authenticated: ${user.name} (${user.role})`);

    // 创建会话
    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 