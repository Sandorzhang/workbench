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

interface RolePermissionTableProps {
  data: {
    id: number
    roleId: string
    roleName: string
    applications: number[]
  }[]
  onUpdate: (roleId: string, applications: number[]) => void
}

export function RolePermissionTable({ data, onUpdate }: RolePermissionTableProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApps, setSelectedApps] = useState<Record<string, number[]>>({})

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
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色</TableHead>
            {applications.map(app => (
              <TableHead key={app.id}>{app.name}</TableHead>
            ))}
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(role => (
            <TableRow key={role.roleId}>
              <TableCell>{role.roleName}</TableCell>
              {applications.map(app => (
                <TableCell key={app.id}>
                  <Checkbox
                    checked={(selectedApps[role.roleId] || []).includes(app.id)}
                    onCheckedChange={() => handleToggleApp(role.roleId, app.id)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(role.roleId)}
                >
                  保存
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 