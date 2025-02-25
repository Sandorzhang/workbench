'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { fetchUserApplications } from '@/lib/api/auth'
import type { Application } from '@/lib/api/auth'
import { Badge } from "@/components/ui/badge"
import { ROUTES } from '@/lib/constants/routes'

interface RolePermissionTableProps {
  appId: string
  onRoleClick: (roleId: string) => void
}

export function RolePermissionTable({ appId, onRoleClick }: RolePermissionTableProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApps, setSelectedApps] = useState<Record<string, number[]>>({})
  const [editingRole, setEditingRole] = useState<string | null>(null)

  // 加载所有应用列表
  useEffect(() => {
    async function loadApplications() {
      try {
        const apps = await fetchUserApplications()
        // 过滤掉应用权限管理应用
        const filteredApps = apps.filter(app => app.id !== 1)
        setApplications(filteredApps)
      } catch (error) {
        console.error('加载应用列表失败:', error)
      }
    }

    loadApplications()
  }, [])

  // 初始化选中状态
  useEffect(() => {
    const initialState: Record<string, number[]> = {}
    // 这里需要根据 appId 加载角色权限数据
    // 目前假设 selectedApps 已经存在
  }, [appId])

  const handleToggleApp = (roleId: string, appId: number) => {
    setSelectedApps(prev => {
      const current = prev[roleId] || []
      const updated = current.includes(appId)
        ? current.filter(id => id !== appId)
        : [...current, appId]
      return { ...prev, [roleId]: updated }
    })
  }

  const handleSave = (roleId: string) => {
    // 这里需要根据 appId 更新角色权限数据
    setEditingRole(null)
  }

  const handleRoleClick = (roleId: string) => {
    window.location.href = ROUTES.APP_MANAGEMENT.ROLES.DETAIL(roleId)
  }

  return (
    <div className="space-y-6">
      {/* 表格内容 */}
    </div>
  )
} 