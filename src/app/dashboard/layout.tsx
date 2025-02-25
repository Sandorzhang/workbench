'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/common/ui/toaster"
import { Navbar } from "@/components/features/dashboard/navbar"

interface User {
  id: number
  name: string
  role: string
  avatar: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // 检查用户登录状态
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    setUser(user)

    // 检查用户角色
    if (window.location.pathname.includes('/app-management') && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="p-6">
        {children}
      </main>
      <Toaster />
    </div>
  )
} 