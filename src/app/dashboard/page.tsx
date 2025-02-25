'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/ui/card"
import { 
  GraduationCap, Settings, BookOpen, Users, PenTool, Camera, Calendar, 
  Database, BarChart, Layers, FileText, Clock, School, ChartPie, Target, ArrowRight
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/common/ui/badge"
import * as Icons from "lucide-react"
import { fetchCurrentTenant } from "@/lib/api/tenant"
import type { Tenant } from "@/lib/api/tenant"
import { useAuth } from "@/hooks/use-auth"
import { fetchUserApplications } from "@/lib/api/auth"
import type { Application } from "@/lib/api/auth"
import { cn } from "@/lib/types/utils"
import { PageHeader } from "@/components/common/layout/page-header"

// 应用分类定义
const APP_CATEGORIES = {
  teaching: {
    name: '智能教学',
    description: '课程、教案和教学资源管理',
    apps: ['unit-teaching', 'chinese-writing', 'classroom-moments'] as const
  },
  analysis: {
    name: '智能分析',
    description: '学生发展轨迹和模型分析',
    apps: ['academic-journey', 'class-model']
  },
  evaluation: {
    name: '智能评价',
    description: '智能化教学评价工具',
    apps: ['situational-assessment']
  },
  base: {
    name: '基础管理',
    description: '系统基础功能管理',
    apps: ['app-management', 'student-management', 'teacher-management', 'class-schedule', 'data-category']
  }
} as const

// 分类颜色定义
const CATEGORY_COLORS: Record<string, { text: string, bg: string }> = {
  'teaching': { text: "text-emerald-600", bg: "bg-emerald-50" },
  'analysis': { text: "text-blue-600", bg: "bg-blue-50" },
  'evaluation': { text: "text-purple-600", bg: "bg-purple-50" },
  'base': { text: "text-slate-600", bg: "bg-slate-50" }
}

// 应用图标映射
const APP_ICONS: Record<string, { icon: LucideIcon, colors: { text: string, bg: string } }> = {
  'app-management': {
    icon: Settings,
    colors: CATEGORY_COLORS.base
  },
  'unit-teaching': {
    icon: BookOpen,
    colors: CATEGORY_COLORS.teaching
  },
  'academic-journey': {
    icon: GraduationCap,
    colors: CATEGORY_COLORS.analysis
  },
  'chinese-writing': {
    icon: PenTool,
    colors: CATEGORY_COLORS.teaching
  },
  'classroom-moments': {
    icon: Camera,
    colors: CATEGORY_COLORS.teaching
  },
  'class-schedule': {
    icon: Calendar,
    colors: CATEGORY_COLORS.base
  },
  'data-category': {
    icon: Database,
    colors: CATEGORY_COLORS.base
  },
  'class-model': {
    icon: BarChart,
    colors: CATEGORY_COLORS.analysis
  },
  'situational-assessment': {
    icon: Target,
    colors: CATEGORY_COLORS.evaluation
  },
  'student-management': {
    icon: Users,
    colors: CATEGORY_COLORS.base
  },
  'teacher-management': {
    icon: GraduationCap,
    colors: CATEGORY_COLORS.base
  }
}

// 应用所属分类映射
const APP_CATEGORIES_MAP: Record<string, string> = {
  'unit-teaching': 'teaching',
  'chinese-writing': 'teaching',
  'classroom-moments': 'teaching',
  'academic-journey': 'analysis',
  'class-model': 'analysis',
  'situational-assessment': 'evaluation',
  'app-management': 'base',
  'student-management': 'base',
  'class-schedule': 'base',
  'data-category': 'base',
  'teacher-management': 'base'
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.replace('/login')
    }
  }, [router])

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

  // 修改按分类组织应用的逻辑
  const categorizedApps = Object.entries(APP_CATEGORIES)
    .map(([id, category]) => ({
      id,
      name: category.name,
      description: category.description,
      apps: applications.filter((app: Application) => 
        typeof app.code === 'string' && 
        (category.apps as readonly string[]).includes(app.code)
      )
    }))
    .filter(category => category.apps.length > 0)

  // 获取应用的图标和颜色
  const getAppIconAndColor = (appCode: string) => {
    const { icon: Icon, colors } = APP_ICONS[appCode]
    const categoryId = APP_CATEGORIES_MAP[appCode]
    const categoryColors = CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.base

    return {
      icon: Icon ? <Icon className={cn("h-5 w-5", colors.text)} /> : null,
      colors: {
        ...categoryColors,
        ...colors
      }
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/30 backdrop-blur-3xl -z-10" />

      <PageHeader
        title="工作台"
        description={`欢迎使用${tenant?.name || '教学管理平台'}`}
        icon={Layers}
      />

      {categorizedApps.map((category) => (
        <div key={category.id} className="space-y-4">
          <div>
            <h2 className={cn(
              "text-xl font-semibold flex items-center gap-2 text-slate-900"
            )}>
              {category.id === 'teaching' && <BookOpen className="h-5 w-5" />}
              {category.id === 'analysis' && <ChartPie className="h-5 w-5" />}
              {category.id === 'evaluation' && <Target className="h-5 w-5" />}
              {category.id === 'base' && <Settings className="h-5 w-5" />}
              {category.name}
            </h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.apps.map(app => {
              const { icon, colors } = getAppIconAndColor(app.code)
              
              return (
                <Link 
                  key={app.id}
                  href={`/dashboard/${app.code}`}
                  className="outline-none"
                >
                  <Card className={cn(
                    "group relative overflow-hidden",
                    "transition-all duration-200",
                    "hover:shadow-md hover:-translate-y-0.5",
                    "bg-white"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={cn(
                          "rounded-xl p-2.5",
                          "transition-colors duration-200",
                          colors.bg,
                          "group-hover:bg-opacity-80"
                        )}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-slate-900 truncate">
                            {app.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                            {app.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
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