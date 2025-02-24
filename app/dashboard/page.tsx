'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Settings, BookOpen, Users } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
}

export default function DashboardPage() {
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

      // 获取用户的应用权限
      const userAppResponse = await fetch(`http://localhost:3100/userApplications?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!userAppResponse.ok) {
        throw new Error('获取用户应用权限失败')
      }
      const userAppData = await userAppResponse.json()
      const userApp = userAppData[0]

      if (!userApp) {
        toast({
          title: "提示",
          description: "当前用户没有任何应用权限",
        })
        return
      }

      // 获取租户的所有应用
      const tenantAppResponse = await fetch(`http://localhost:3100/tenantApplications?tenantId=${user.tenantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!tenantAppResponse.ok) {
        throw new Error('获取租户应用列表失败')
      }
      const tenantAppData = await tenantAppResponse.json()
      const tenantApps = tenantAppData[0]?.applications || []

      // 过滤出用户有权限的应用
      const authorizedApps = tenantApps.filter((app: Application) => 
        userApp.applicationIds.includes(app.id)
      )
      
      if (authorizedApps.length === 0) {
        toast({
          title: "提示",
          description: "没有找到可用的应用",
        })
      }
      
      setApplications(authorizedApps)
    } catch (error) {
      console.error('加载应用列表失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "加载应用列表失败",
      })
    }
  }

  const getAppIcon = (iconName: string) => {
    const icons = {
      'GraduationCap': GraduationCap,
      'graduationcap': GraduationCap,
      'Settings': Settings,
      'settings': Settings,
      'BookOpen': BookOpen,
      'bookopen': BookOpen,
      'Users': Users,
      'users': Users
    }
    const Icon = icons[iconName as keyof typeof icons] || icons[iconName.toLowerCase() as keyof typeof icons]
    return Icon ? <Icon className="h-6 w-6" /> : null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">工作台</h1>
        <p className="text-muted-foreground">选择需要使用的应用模块</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map(app => (
          <Card 
            key={app.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/dashboard/${app.code}`)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getAppIcon(app.icon)}
                {app.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 