'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { 
  fetchRolePermissions, 
  updateRolePermissions, 
  fetchUserPermissions, 
  updateUserPermissions,
  type RolePermission,
  type UserPermission 
} from '@/lib/api/app-management'
import { RolePermissionTable } from './role-permission-table'
import { UserPermissionTable } from './user-permission-table'

export default function AppManagementPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPermissions() {
      if (!user?.tenantId) return

      try {
        setIsLoading(true)
        const [roles, users] = await Promise.all([
          fetchRolePermissions(user.tenantId),
          fetchUserPermissions(user.tenantId)
        ])
        setRolePermissions(roles)
        setUserPermissions(users)
      } catch (error) {
        console.error('加载权限配置失败:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载权限配置失败"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [user, toast])

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-500">访问受限</CardTitle>
            <CardDescription className="text-center">
              您没有权限访问此页面
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">应用权限管理</h1>
          <p className="text-muted-foreground">
            管理教师用户对各个应用的访问权限
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="roles" className="space-y-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="roles">角色权限配置</TabsTrigger>
              <TabsTrigger value="users">用户权限配置</TabsTrigger>
            </TabsList>
            <TabsContent value="roles" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">角色权限</h2>
                  <p className="text-sm text-muted-foreground">
                    配置不同角色可以访问的应用
                  </p>
                </div>
              </div>
              <RolePermissionTable 
                data={rolePermissions}
                onUpdate={async (roleId, apps) => {
                  if (!user?.tenantId) return

                  try {
                    await updateRolePermissions(user.tenantId, roleId, apps)
                    toast({ title: "成功", description: "角色权限更新成功" })
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "错误",
                      description: "角色权限更新失败"
                    })
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">用户权限</h2>
                  <p className="text-sm text-muted-foreground">
                    为教师配置个性化的应用访问权限
                  </p>
                </div>
              </div>
              <UserPermissionTable 
                data={userPermissions}
                onUpdate={async (userId, apps) => {
                  try {
                    await updateUserPermissions(userId, apps)
                    
                    // 重新加载权限数据
                    if (user?.tenantId) {
                      const updatedPermissions = await fetchUserPermissions(user.tenantId)
                      setUserPermissions(updatedPermissions)
                    }

                    toast({ 
                      title: "成功", 
                      description: "用户权限更新成功",
                      variant: "default"
                    })
                  } catch (error) {
                    console.error('更新用户权限失败:', error)
                    toast({
                      variant: "destructive",
                      title: "错误",
                      description: "用户权限更新失败"
                    })
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 