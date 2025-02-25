'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { fetchUserApplications } from '@/lib/api/auth'
import type { Application } from '@/lib/api/auth'
import { fetchRolePermissions, type RolePermission } from '@/lib/api/app-management'
import { useAuth } from '@/hooks/use-auth'
import type { UserPermission } from '@/lib/api/app-management'

interface UserPermissionTableProps {
  data: UserPermission[]
  onUpdate: (userId: number, applications: number[]) => void
}

export function UserPermissionTable({ data, onUpdate }: UserPermissionTableProps) {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [selectedApps, setSelectedApps] = useState<Record<number, number[]>>({})

  // 加载所有应用列表和角色权限
  useEffect(() => {
    async function loadData() {
      try {
        if (!user?.tenantId) return

        const [apps, roles] = await Promise.all([
          fetchUserApplications(),
          fetchRolePermissions(user.tenantId)
        ])

        // 过滤掉管理员专属应用
        const filteredApps = apps.filter(app => !app.adminOnly)
        setApplications(filteredApps)
        setRolePermissions(roles)
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }

    loadData()
  }, [user])

  // 初始化选中状态
  useEffect(() => {
    const initialState: Record<number, number[]> = {}
    data.forEach(user => {
      initialState[user.userId] = user.applicationIds
    })
    setSelectedApps(initialState)
  }, [data])

  // 获取用户的角色权限范围
  const getRolePermissions = (userId: number) => {
    const userData = data.find(p => p.userId === userId)
    if (!userData?.user) return []

    const rolePermission = rolePermissions.find(r => r.roleId === userData.user.role)
    return rolePermission?.applications || []
  }

  const handleToggleApp = (userId: number, appId: number) => {
    // 检查是否在角色权限范围内
    const roleApps = getRolePermissions(userId)
    if (!roleApps.includes(appId)) return

    setSelectedApps(prev => {
      const current = prev[userId] || []
      const updated = current.includes(appId)
        ? current.filter(id => id !== appId)
        : [...current, appId]
      return { ...prev, [userId]: updated }
    })
  }

  const handleSave = (userId: number) => {
    // 确保保存的权限在角色权限范围内
    const roleApps = getRolePermissions(userId)
    const validApps = (selectedApps[userId] || []).filter(appId => 
      roleApps.includes(appId)
    )
    onUpdate(userId, validApps)
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户名</TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>角色</TableHead>
            {applications.map(app => (
              <TableHead key={app.id}>{app.name}</TableHead>
            ))}
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(permission => {
            if (!permission.user) return null // 跳过没有用户信息的记录
            
            const roleApps = getRolePermissions(permission.userId)
            return (
              <TableRow key={permission.userId}>
                <TableCell>{permission.user.username}</TableCell>
                <TableCell>{permission.user.name}</TableCell>
                <TableCell>{permission.user.role === 'ADMIN' ? '管理员' : '教师'}</TableCell>
                {applications.map(app => (
                  <TableCell key={app.id}>
                    <Checkbox
                      checked={(selectedApps[permission.userId] || []).includes(app.id)}
                      disabled={!roleApps.includes(app.id)}
                      onCheckedChange={() => handleToggleApp(permission.userId, app.id)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(permission.userId)}
                  >
                    保存
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
} 