'use client'

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/types/utils"
import { Button } from "@/components/common/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/ui/avatar"
import { useState, useEffect } from "react"

// 定义用户类型
interface User {
  id: number
  name: string
  username: string
  role: string
  avatar?: string
  email?: string
  tenantId: number
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/dashboard'

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        // 确保必要的字段存在
        if (!userData.name) {
          userData.name = userData.username || '未知用户'
        }
        if (!userData.avatar) {
          userData.avatar = '/avatars/default.png'
        }
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        // 解析失败时重定向到登录页
        router.push('/login')
      }
    } else {
      // 没有用户数据时重定向到登录页
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  // 如果没有用户数据，显示加载状态或空内容
  if (!user) {
    return <div className="border-b h-16" /> // 保持导航栏高度一致
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        {isHomePage ? (
          <div className="text-xl font-semibold">数智大脑工作台</div>
        ) : (
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-xl font-semibold hover:bg-transparent px-0"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            数智大脑工作台
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage 
                  src={user.avatar} 
                  alt={user.name}
                  onError={(e) => {
                    // 图片加载失败时使用默认头像
                    e.currentTarget.src = '/avatars/default.png'
                  }}
                />
                <AvatarFallback>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-medium">
              {user.name || user.username || '未知用户'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 