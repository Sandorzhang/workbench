// 添加调试输出
console.log('Login form submitted:', { username, password });

// 确保请求正确发送
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  console.log('Login response status:', response.status);
  
  const data = await response.json();
  console.log('Login response data:', data);
  
  // 处理响应...
} catch (error) {
  console.error('Login request error:', error);
  // 处理错误...
} 