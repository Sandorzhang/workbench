'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  role: string
  avatar: string
  tenantId: number
}

interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
  features: Array<{
    id: number
    code: string
    name: string
  }>
}

interface UserApplication {
  id: number
  userId: number
  tenantId: number
  applicationIds: number[]
  featureIds: number[]
}

interface AppCardProps {
  title: string
  description: string
  onClick?: () => void
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tenantApps, setTenantApps] = useState<Application[]>([])
  const [userApps, setUserApps] = useState<UserApplication | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)
    setUser(user)

    // 获取租户应用信息
    const fetchApps = async () => {
      try {
        // 获取租户所有应用
        const tenantResponse = await fetch(`http://localhost:3100/tenantApplications?tenantId=${user.tenantId}`)
        const tenantData = await tenantResponse.json()
        if (tenantData.length > 0) {
          setTenantApps(tenantData[0].applications)
        }

        // 如果是教师，获取用户应用权限
        if (user.role === 'teacher') {
          const userResponse = await fetch(`http://localhost:3100/userApplications?userId=${user.id}`)
          const userData = await userResponse.json()
          if (userData.length > 0) {
            setUserApps(userData[0])
          }
        }
      } catch (error) {
        console.error('获取应用数据失败:', error)
      }
    }

    fetchApps()
  }, [router])

  if (!user) return null

  const getAvailableApps = () => {
    if (user.role === 'admin') {
      return tenantApps
    }
    return tenantApps.filter(app => 
      userApps?.applicationIds.includes(app.id) && 
      app.code !== 'app_management'
    )
  }

  // 根据应用类型跳转到不同路由
  const handleAppClick = (app: Application) => {
    switch (app.code) {
      case 'app_management':
        router.push('/dashboard/app-management')  // 不需要 appId
        break
      case 'unit_teaching':
        router.push('/dashboard/unit-teaching')
        break
      default:
        console.warn('未知的应用类型:', app.code)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {getAvailableApps().map(app => (
        <AppCard 
          key={app.id}
          title={app.name}
          description={app.description}
          onClick={() => handleAppClick(app)}
        />
      ))}
    </div>
  )
}

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