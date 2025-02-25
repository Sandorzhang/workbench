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

interface UserPermissionTableProps {
  data: {
    id: number
    userId: number
    userName: string
    applicationIds: number[]
  }[]
  onUpdate: (userId: number, applications: number[]) => void
}

export function UserPermissionTable({ data, onUpdate }: UserPermissionTableProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApps, setSelectedApps] = useState<Record<number, number[]>>({})

  // 加载所有应用列表
  useEffect(() => {
    async function loadApplications() {
      try {
        const apps = await fetchUserApplications()
        setApplications(apps)
      } catch (error) {
        console.error('加载应用列表失败:', error)
      }
    }

    loadApplications()
  }, [])

  // 初始化选中状态
  useEffect(() => {
    const initialState: Record<number, number[]> = {}
    data.forEach(user => {
      initialState[user.userId] = user.applicationIds
    })
    setSelectedApps(initialState)
  }, [data])

  const handleToggleApp = (userId: number, appId: number) => {
    setSelectedApps(prev => {
      const current = prev[userId] || []
      const updated = current.includes(appId)
        ? current.filter(id => id !== appId)
        : [...current, appId]
      return { ...prev, [userId]: updated }
    })
  }

  const handleSave = (userId: number) => {
    onUpdate(userId, selectedApps[userId] || [])
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            {applications.map(app => (
              <TableHead key={app.id}>{app.name}</TableHead>
            ))}
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(user => (
            <TableRow key={user.userId}>
              <TableCell>{user.userName}</TableCell>
              {applications.map(app => (
                <TableCell key={app.id}>
                  <Checkbox
                    checked={(selectedApps[user.userId] || []).includes(app.id)}
                    onCheckedChange={() => handleToggleApp(user.userId, app.id)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(user.userId)}
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