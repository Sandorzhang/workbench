'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { fetchUserApplications } from '@/lib/api/auth'
import type { Application } from '@/lib/api/auth'
import { fetchRolePermissions, type RolePermission, type UserPermission } from '@/lib/api/app-management'
import { useAuth } from '@/hooks/use-auth'

interface UserPermissionTableProps {
  data: UserPermission[]
  onUpdate: (userId: number, applications: number[]) => void
}

export function UserPermissionTable({ data, onUpdate }: UserPermissionTableProps) {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [selectedApps, setSelectedApps] = useState<Record<number, number[]>>({})
  const [searchQuery, setSearchQuery] = useState('')

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

  // 过滤用户列表
  const filteredUsers = data.filter(permission => {
    if (!permission.user) return false
    
    const searchText = searchQuery.toLowerCase()
    return (
      permission.user.name.toLowerCase().includes(searchText) ||
      permission.user.username.toLowerCase().includes(searchText)
    )
  })

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>共 {data.length} 个用户</span>
          {searchQuery && (
            <>
              <span>|</span>
              <span>找到 {filteredUsers.length} 个匹配用户</span>
            </>
          )}
        </div>
      </div>

      {/* 用户列表 */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map(permission => {
          if (!permission.user) return null
          
          const roleApps = getRolePermissions(permission.userId)
          return (
            <Card key={permission.userId}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {permission.user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {permission.user.name}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({permission.user.username})
                        </span>
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {permission.user.role === 'ADMIN' ? '管理员' : '教师'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(permission.userId)}
                  >
                    保存更改
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applications.map(app => {
                    const isEnabled = (selectedApps[permission.userId] || []).includes(app.id)
                    const isAllowed = roleApps.includes(app.id)

                    return (
                      <div
                        key={app.id}
                        className={`p-4 rounded-lg border ${
                          isAllowed ? 'hover:border-primary cursor-pointer' : 'opacity-50'
                        }`}
                        onClick={() => {
                          if (isAllowed) {
                            handleToggleApp(permission.userId, app.id)
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{app.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {app.code}
                              </span>
                            </div>
                          </div>
                          <Switch
                            checked={isEnabled}
                            disabled={!isAllowed}
                            onCheckedChange={() => handleToggleApp(permission.userId, app.id)}
                          />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {app.description}
                        </p>
                        {!isAllowed && (
                          <Badge variant="secondary" className="mt-2">
                            角色未授权
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">
              {searchQuery ? (
                <>
                  <p className="text-lg">未找到匹配的用户</p>
                  <p className="text-sm mt-1">
                    尝试使用其他关键词搜索
                  </p>
                </>
              ) : (
                <p className="text-lg">暂无用户数据</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 