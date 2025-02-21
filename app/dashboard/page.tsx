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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userStr))
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
          {user.role === 'admin' && (
            <>
              <AppCard title="用户管理" description="管理系统用户账号和权限" />
              <AppCard title="系统设置" description="配置系统参数和功能" />
              <AppCard title="数据统计" description="查看系统使用数据统计" />
            </>
          )}
          {user.role === 'teacher' && (
            <>
              <AppCard title="课程管理" description="管理您的教学课程" />
              <AppCard title="学生管理" description="查看学生信息和成绩" />
              <AppCard title="教学资源" description="管理教学课件和资料" />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

// 应用卡片组件
function AppCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
} 