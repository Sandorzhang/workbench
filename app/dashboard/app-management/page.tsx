'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
}

export default function AppManagementPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:3100/applications')
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error('加载应用列表失败:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">应用权限管理</h1>
        <p className="text-muted-foreground">选择需要管理权限的应用模块</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map(app => (
          <Card 
            key={app.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/dashboard/app-management/${app.id}`)}
          >
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
} 