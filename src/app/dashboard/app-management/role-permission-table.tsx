'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/common/ui/card"
import { Button } from "@/components/common/ui/button"
import { Switch } from "@/components/common/ui/switch"
import { Badge } from "@/components/common/ui/badge"
import { fetchUserApplications } from '@/lib/api/auth'
import type { Application } from '@/lib/api/auth'
import { ROUTES } from '@/lib/constants/routes'

interface RolePermissionTableProps {
  appId: string
  onRoleClick: (roleId: string) => void
  data: {
    id: number
    roleId: string
    roleName: string
    applications: number[]
  }[]
  onUpdate: (roleId: string, applications: number[]) => void
}

export function RolePermissionTable({ appId, onRoleClick, data, onUpdate }: RolePermissionTableProps) {
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
    data.forEach(role => {
      initialState[role.roleId] = role.applications
    })
    setSelectedApps(initialState)
  }, [data])

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
    onUpdate(roleId, selectedApps[roleId] || [])
    setEditingRole(null)
  }

  const handleRoleClick = (roleId: string) => {
    window.location.href = ROUTES.APP_MANAGEMENT.ROLES.DETAIL(roleId)
  }

  return (
    <div className="space-y-6">
      {data.map(role => (
        <Card key={role.roleId} className="relative">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{role.roleName}</h3>
                <p className="text-sm text-muted-foreground">
                  已启用 {(selectedApps[role.roleId] || []).length} 个应用
                </p>
              </div>
              {editingRole === role.roleId ? (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingRole(null)}
                  >
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSave(role.roleId)}
                  >
                    保存
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRole(role.roleId)}
                >
                  编辑权限
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className={`p-4 rounded-lg border ${
                    editingRole === role.roleId
                      ? 'hover:border-primary cursor-pointer'
                      : ''
                  }`}
                  onClick={() => {
                    if (editingRole === role.roleId) {
                      handleToggleApp(role.roleId, app.id)
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
                    {editingRole === role.roleId ? (
                      <Switch
                        checked={(selectedApps[role.roleId] || []).includes(app.id)}
                        onCheckedChange={() => handleToggleApp(role.roleId, app.id)}
                      />
                    ) : (
                      <Badge variant={(selectedApps[role.roleId] || []).includes(app.id) ? "default" : "secondary"}>
                        {(selectedApps[role.roleId] || []).includes(app.id) ? "已启用" : "未启用"}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {app.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 