'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
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
    return <div>无权访问</div>
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>应用权限管理</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles">
            <TabsList>
              <TabsTrigger value="roles">角色权限</TabsTrigger>
              <TabsTrigger value="users">用户权限</TabsTrigger>
            </TabsList>
            <TabsContent value="roles">
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
            <TabsContent value="users">
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