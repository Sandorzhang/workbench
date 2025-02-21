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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  name: string
  role: string
  department: string
  avatar: string
}

interface Feature {
  id: number
  code: string
  name: string
}

interface Application {
  id: number
  code: string
  name: string
  description: string
  features: Feature[]
}

interface UserApplication {
  id: number
  userId: number
  applicationIds: number[]
  featureIds: number[]
}

export default function AppDetailPage({ params }: { params: { appId: string } }) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [teachers, setTeachers] = useState<User[]>([])
  const [userApplications, setUserApplications] = useState<UserApplication[]>([])

  useEffect(() => {
    loadData()
  }, [params.appId])

  const loadData = async () => {
    try {
      // 获取应用详情
      const appResponse = await fetch(`http://localhost:3100/applications/${params.appId}`)
      const appData = await appResponse.json()
      setApplication(appData)

      // 获取教师列表
      const teachersResponse = await fetch('http://localhost:3100/users?role=teacher')
      const teachersData = await teachersResponse.json()
      setTeachers(teachersData)

      // 获取用户应用权限
      const userAppsResponse = await fetch('http://localhost:3100/userApplications')
      const userAppsData = await userAppsResponse.json()
      setUserApplications(userAppsData)
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  const handleFeatureChange = async (userId: number, featureId: number, checked: boolean) => {
    try {
      const userApp = userApplications.find(ua => ua.userId === userId)
      let updatedUserApp: UserApplication

      if (userApp) {
        // 更新现有权限
        updatedUserApp = {
          ...userApp,
          applicationIds: checked 
            ? [...new Set([...userApp.applicationIds, Number(params.appId)])]
            : userApp.applicationIds,
          featureIds: checked
            ? [...new Set([...userApp.featureIds, featureId])]
            : userApp.featureIds.filter(id => id !== featureId)
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
          applicationIds: [Number(params.appId)],
          featureIds: [featureId]
        }

        await fetch('http://localhost:3100/userApplications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUserApp)
        })
      }

      setUserApplications(prev => 
        userApp
          ? prev.map(ua => ua.id === userApp.id ? updatedUserApp : ua)
          : [...prev, updatedUserApp]
      )

      toast({
        title: "权限更新成功",
        description: "已保存用户功能权限更改",
      })
    } catch (error) {
      console.error('更新权限失败:', error)
      toast({
        title: "权限更新失败",
        description: "保存权限更改时出现错误",
        variant: "destructive",
      })
    }
  }

  if (!application) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{application.name}</h1>
        <p className="text-muted-foreground">{application.description}</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教师</TableHead>
              <TableHead>部门</TableHead>
              {application.features.map(feature => (
                <TableHead key={feature.id}>{feature.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map(teacher => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{teacher.name}</span>
                  </div>
                </TableCell>
                <TableCell>{teacher.department}</TableCell>
                {application.features.map(feature => {
                  const userApp = userApplications.find(ua => ua.userId === teacher.id)
                  const hasPermission = userApp?.featureIds.includes(feature.id)

                  return (
                    <TableCell key={feature.id}>
                      <Checkbox
                        checked={hasPermission}
                        onCheckedChange={(checked) => 
                          handleFeatureChange(teacher.id, feature.id, checked as boolean)
                        }
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