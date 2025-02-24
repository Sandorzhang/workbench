// 简单的认证函数
export async function auth() {
  // 这里可以实现实际的认证逻辑
  // 现在返回模拟数据
  return {
    user: {
      id: "1", // 添加 id 字段
      role: "ADMIN", // 或 "TEACHER"
      name: "管理员",
      // ... 其他用户信息
    }
  }
} 