'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Settings, BookOpen, Users, PenTool, Camera, Calendar, Database } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import * as Icons from "lucide-react"
import { fetchCurrentTenant } from "@/lib/api/tenant"
import type { Tenant } from "@/lib/api/tenant"

// 应用分类定义
const APP_CATEGORIES = {
  TEACHING: {
    id: 'teaching',
    name: '教学管理',
    description: '课程、教案和教学资源管理',
    apps: ['unit-teaching', 'chinese-writing', 'classroom-moments', 'class-schedule', 'data-category']
  },
  STUDENT: {
    id: 'student',
    name: '学生管理',
    description: '学生信息和学业发展管理',
    apps: ['student-management', 'academic-journey']
  },
  SYSTEM: {
    id: 'system',
    name: '系统管理',
    description: '系统和权限管理',
    apps: ['app-management']
  }
}

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
  const [tenant, setTenant] = useState<Tenant | null>(null)

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

      // 获取租户信息
      const tenantData = await fetchCurrentTenant()
      setTenant(tenantData)

      // 获取用户的应用权限
      const userAppResponse = await fetch(`http://localhost:3100/userApplications?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!userAppResponse.ok) {
        throw new Error('Failed to fetch user applications')
      }

      const userAppData = await userAppResponse.json()
      const userApp = userAppData[0]

      // 获取租户的应用列表
      const tenantAppResponse = await fetch(`http://localhost:3100/tenantApplications?tenantId=${user.tenantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!tenantAppResponse.ok) {
        throw new Error('Failed to fetch tenant applications')
      }

      const tenantAppData = await tenantAppResponse.json()
      const tenantApp = tenantAppData[0]

      // 过滤出用户有权限的应用
      const userApps = tenantApp.applications.filter((app: any) => 
        userApp.applicationIds.includes(app.id)
      )

      setApplications(userApps)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载数据失败"
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
      'users': Users,
      'PenTool': PenTool,
      'pentool': PenTool,
      'Camera': Camera,
      'camera': Camera,
      'Calendar': Calendar,
      'calendar': Calendar,
      'Database': Database,
      'database': Database,
    }
    const Icon = icons[iconName as keyof typeof icons] || icons[iconName.toLowerCase() as keyof typeof icons]
    return Icon ? <Icon className="h-6 w-6" /> : null
  }

  // 按分类对应用进行分组
  const categorizedApps = Object.values(APP_CATEGORIES).map(category => ({
    ...category,
    apps: applications.filter(app => category.apps.includes(app.code))
  })).filter(category => category.apps.length > 0)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">工作台</h1>
        <p className="text-sm text-muted-foreground mt-1">
          欢迎使用教学管理平台
        </p>
      </div>

      {categorizedApps.map((category) => (
        <div key={category.id} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.apps.map((app) => {
              const IconComponent = Icons[app.icon as keyof typeof Icons] as LucideIcon

              return (
                <Link
                  key={app.id}
                  href={`/dashboard/${app.code}`}
                  className="block group"
                >
                  <Card className="p-6 hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {app.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {app.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
} 