'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
  features: {
    id: number
    code: string
    name: string
  }[]
}

export default function AppManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        router.push('/login')
        return
      }
      const user = JSON.parse(userStr)

      // 获取租户的所有应用
      const response = await fetch(`http://localhost:3100/tenantApplications?tenantId=${user.tenantId}`)
      if (!response.ok) {
        throw new Error('获取应用列表失败')
      }
      const data = await response.json()
      
      // 确保我们获取到了正确的应用列表
      const apps = data[0]?.applications || []
      setApplications(apps)
    } catch (error) {
      console.error('加载应用列表失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "加载应用列表失败",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">应用权限管理</h1>
        <p className="text-muted-foreground">管理教师用户的应用权限</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map(app => (
          <Card key={app.id}>
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">功能权限：</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {app.features.map(feature => (
                    <li key={feature.id}>{feature.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 