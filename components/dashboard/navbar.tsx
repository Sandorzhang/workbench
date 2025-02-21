'use client'

import { useRouter, usePathname } from 'next/navigation'
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

interface NavbarProps {
  user: User
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleTitleClick = () => {
    // 如果不是在工作台首页，则跳转到工作台
    if (pathname !== '/dashboard') {
      router.push('/dashboard')
    }
  }

  return (
    <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between">
      <h1 
        className="text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors"
        onClick={handleTitleClick}
      >
        数智大脑工作台
      </h1>
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
  )
} 