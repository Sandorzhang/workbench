'use client'

import { useEffect, useState } from 'react'
import { getUser } from '@/lib/types/auth'
import type { User } from '@/lib/types/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (currentUser) {
      if (!currentUser.id || !currentUser.role || !currentUser.tenantId) {
        console.error('Invalid user data:', currentUser)
        return
      }
      setUser(currentUser)
    }
  }, [])

  const hasPermission = (permission: string) => {
    if (!user) return false
    if (user.role === 'ADMIN') return true
    // 教师默认拥有基本权限
    if (user.role === 'TEACHER') {
      const teacherDefaultPermissions = [
        'view_units',
        'view_academic_journey',
        'view_writings',
        'view_moments',
        'view_schedule',
        'view_class_model',
        'view_assessment'
      ]
      return teacherDefaultPermissions.includes(permission)
    }
    return false
  }

  return { user, hasPermission }
} 