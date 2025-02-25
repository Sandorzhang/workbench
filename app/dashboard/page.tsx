'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  GraduationCap, Settings, BookOpen, Users, PenTool, Camera, Calendar, 
  Database, BarChart, Layers, FileText, Clock, School, ChartPie, Target
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import * as Icons from "lucide-react"
import { fetchCurrentTenant } from "@/lib/api/tenant"
import type { Tenant } from "@/lib/api/tenant"
import { useAuth } from "@/hooks/use-auth"
import { fetchUserApplications } from "@/lib/api/auth"
import { cn } from "@/lib/utils"

// 应用分类定义
const APP_CATEGORIES = {
  TEACHING: {
    id: 'teaching',
    name: '智能教学',
    description: '课程、教案和教学资源管理',
    apps: ['unit-teaching', 'chinese-writing', 'classroom-moments']
  },
  ANALYSIS: {
    id: 'analysis',
    name: '智能分析',
    description: '学生发展轨迹和模型分析',
    apps: ['academic-journey', 'class-model']
  },
  EVALUATION: {
    id: 'evaluation',
    name: '智能评价',
    description: '智能化教学评价工具',
    apps: ['situational-assessment']
  },
  BASE: {
    id: 'base',
    name: '基础管理',
    description: '系统基础功能管理',
    apps: ['app-management', 'student-management', 'class-schedule', 'data-category']
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
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      if (!user) return

      try {
        setIsLoading(true)
        const [apps, tenantData] = await Promise.all([
          fetchUserApplications(),
          fetchCurrentTenant()
        ])
        setApplications(apps)
        setTenant(tenantData)
      } catch (error) {
        console.error('加载应用失败:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载数据失败"
        })
        setApplications([])
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [user, toast])

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!user) {
    return <div>请先登录</div>
  }

  // 按分类组织应用
  const categorizedApps = Object.values(APP_CATEGORIES)
    .map(category => ({
      ...category,
      apps: applications.filter(app => category.apps.includes(app.code))
    }))
    .filter(category => category.apps.length > 0)

  // 获取应用的图标组件
  const getAppIcon = (iconName: string) => {
    const icons = {
      GraduationCap,
      Calendar,
      BarChart,
      Settings,
      BookOpen,
      Users,
      PenTool,
      Camera,
      Database,
      Layers,
      FileText,
      Clock,
      School,
      ChartPie,
      Target
    }
    const Icon = icons[iconName as keyof typeof icons]
    // 为每个图标定义特定的颜色
    const iconColors: Record<string, string> = {
      GraduationCap: "text-blue-500",
      Calendar: "text-indigo-500",
      BarChart: "text-purple-500",
      Settings: "text-slate-500",
      BookOpen: "text-emerald-500",
      Users: "text-cyan-500",
      PenTool: "text-violet-500",
      Camera: "text-rose-500",
      Database: "text-amber-500",
      Layers: "text-lime-500",
      FileText: "text-teal-500",
      Clock: "text-sky-500",
      School: "text-green-500",
      ChartPie: "text-orange-500",
      Target: "text-red-500"
    }
    return Icon ? <Icon className={cn("h-6 w-6", iconColors[iconName])} /> : null
  }

  return (
    <div className="container mx-auto py-8 space-y-8 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/30 backdrop-blur-3xl -z-10" />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-violet-50/80 rounded-2xl backdrop-blur-sm" />
        <div className="relative p-6 md:p-8">
          <h1 className="text-3xl font-bold tracking-tight">工作台</h1>
          <p className="text-sm text-muted-foreground mt-1">
            欢迎使用{tenant?.name || '教学管理平台'}
          </p>
        </div>
      </div>

      {categorizedApps.map((category) => (
        <div key={category.id} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {category.id === 'teaching' && <BookOpen className="h-5 w-5" />}
              {category.id === 'analysis' && <ChartPie className="h-5 w-5" />}
              {category.id === 'evaluation' && <Target className="h-5 w-5" />}
              {category.id === 'base' && <Settings className="h-5 w-5" />}
              {category.name}
            </h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.apps.map(app => (
              <Card 
                key={app.id}
                className={cn(
                  "cursor-pointer group transition-all duration-300",
                  "hover:shadow-xl hover:scale-[1.02]",
                  "bg-white/70 backdrop-blur-sm border-white/50",
                  "dark:hover:shadow-primary/20"
                )}
                onClick={() => router.push(`/dashboard/${app.code}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl transition-colors duration-300",
                      "bg-gradient-to-br from-primary/10 to-primary/5 text-primary",
                      "group-hover:from-primary/20 group-hover:to-primary/10"
                    )}>
                      {getAppIcon(app.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {app.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        {app.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 