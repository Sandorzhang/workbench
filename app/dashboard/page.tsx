'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  name: string
  role: string
  avatar: string
}

interface AppCardProps {
  title: string
  description: string
  onClick?: () => void
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [applications, setApplications] = useState([])
  const [userApplications, setUserApplications] = useState(null)

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userStr))

    // 获取应用列表和用户权限
    const fetchData = async () => {
      try {
        const appsResponse = await fetch('http://localhost:3100/applications')
        const appsData = await appsResponse.json()
        setApplications(appsData)

        if (user.role === 'teacher') {
          const userAppsResponse = await fetch(`http://localhost:3100/userApplications?userId=${user.id}`)
          const userAppsData = await userAppsResponse.json()
          setUserApplications(userAppsData[0])
        }
      } catch (error) {
        console.error('获取应用数据失败:', error)
      }
    }

    if (user) {
      fetchData()
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between">
        <h1 className="text-xl font-semibold">数智大脑工作台</h1>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* 工作台内容 */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 根据用户角色显示不同的应用卡片 */}
          {user.role === 'admin' ? (
            <>
              <AppCard 
                title="应用管理" 
                description="管理教师用户的应用权限"
                onClick={() => router.push('/dashboard/app-management')}
              />
              <AppCard title="系统设置" description="配置系统参数和功能" />
              <AppCard title="数据统计" description="查看系统使用数据统计" />
            </>
          ) : (
            <>
              {applications
                .filter(app => userApplications?.applicationIds.includes(app.id))
                .map(app => (
                  <AppCard
                    key={app.id}
                    title={app.name}
                    description={app.description}
                  />
                ))}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

// 应用卡片组件
function AppCard({ title, description, onClick }: AppCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
} 