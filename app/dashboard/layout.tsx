'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // 检查用户登录状态
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    // 检查用户角色
    const user = JSON.parse(userStr)
    if (window.location.pathname.includes('/app-management') && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <>
      {children}
      <Toaster />
    </>
  )
} 