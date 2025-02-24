import type { User } from '@/lib/types/user'

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

export function getUser(): User | null {
  try {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Failed to get user:', error)
    return null
  }
} 