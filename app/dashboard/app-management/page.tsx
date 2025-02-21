'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  role: string
}

interface Application {
  id: number
  code: string
  name: string
  description: string
}

interface UserApplication {
  id: number
  userId: number
  applicationIds: number[]
}

export default function AppManagementPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [teachers, setTeachers] = useState<User[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [userApplications, setUserApplications] = useState<UserApplication[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 检查当前用户是否为管理员
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)
    if (user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    setCurrentUser(user)

    // 加载数据
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      // 获取教师列表
      const teachersResponse = await fetch('http://localhost:3100/users?role=teacher')
      const teachersData = await teachersResponse.json()
      setTeachers(teachersData)

      // 获取应用列表
      const applicationsResponse = await fetch('http://localhost:3100/applications')
      const applicationsData = await applicationsResponse.json()
      setApplications(applicationsData)

      // 获取用户应用权限
      const userApplicationsResponse = await fetch('http://localhost:3100/userApplications')
      const userApplicationsData = await userApplicationsResponse.json()
      setUserApplications(userApplicationsData)
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  const handlePermissionChange = async (userId: number, applicationId: number, checked: boolean) => {
    setIsLoading(true)
    try {
      const userApp = userApplications.find(ua => ua.userId === userId)
      let updatedUserApp: UserApplication

      if (userApp) {
        // 更新现有权限
        updatedUserApp = {
          ...userApp,
          applicationIds: checked
            ? [...userApp.applicationIds, applicationId]
            : userApp.applicationIds.filter(id => id !== applicationId)
        }

        await fetch(`http://localhost:3100/userApplications/${userApp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUserApp)
        })
      } else {
        // 创建新的权限记录
        updatedUserApp = {
          id: Date.now(),
          userId,
          applicationIds: [applicationId]
        }

        await fetch('http://localhost:3100/userApplications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUserApp)
        })
      }

      // 更新本地状态
      setUserApplications(prev => 
        userApp
          ? prev.map(ua => ua.id === userApp.id ? updatedUserApp : ua)
          : [...prev, updatedUserApp]
      )

      toast({
        title: "权限更新成功",
        description: "已保存用户应用权限更改",
      })
    } catch (error) {
      console.error('更新权限失败:', error)
      toast({
        title: "权限更新失败",
        description: "保存权限更改时出现错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) return null

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">应用权限管理</h1>
        <p className="text-muted-foreground">管理教师用户的工作台应用访问权限</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教师</TableHead>
              {applications.map(app => (
                <TableHead key={app.id}>{app.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map(teacher => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                {applications.map(app => {
                  const userApp = userApplications.find(ua => ua.userId === teacher.id)
                  const hasPermission = userApp?.applicationIds.includes(app.id)

                  return (
                    <TableCell key={app.id}>
                      <Checkbox
                        checked={hasPermission}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(teacher.id, app.id, checked as boolean)
                        }
                        disabled={isLoading}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 