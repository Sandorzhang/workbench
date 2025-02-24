'use client'

import { useEffect, useState } from 'react'
import { getUser } from '@/lib/auth'
import type { User } from '@/lib/types/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const hasPermission = (permission: string) => {
    if (!user) return false
    // 管理员拥有所有权限
    if (user.role === 'ADMIN') return true
    // TODO: 检查用户的具体权限
    return false
  }

  return { user, hasPermission }
} 