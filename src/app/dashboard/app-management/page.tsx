'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/common/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Settings } from "lucide-react"
import { 
  fetchTenantRolePermissions,
  updateTenantRolePermissions,
  fetchUserPermissions,
  updateUserPermissions,
  type RolePermission,
  type UserPermission 
} from '@/lib/api/app-management'
import { RolePermissionTable } from './role-permission-table'
import { UserPermissionTable } from './user-permission-table'
import { cn } from "@/lib/types/utils"
import { PageHeader } from "@/components/common/layout/page-header"

export default function AppManagementPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')
  const [isLoading, setIsLoading] = useState(true)
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (user?.tenantId) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user?.tenantId) return

    try {
      setIsLoading(true)
      const [roles, users] = await Promise.all([
        fetchTenantRolePermissions(user.tenantId),
        fetchUserPermissions(user.tenantId)
      ])
      setRolePermissions(roles)
      setUserPermissions(users)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载数据失败，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRolePermissions = async (roleId: string, applications: number[]) => {
    if (!user?.tenantId) return

    try {
      await updateTenantRolePermissions(user.tenantId, roleId, applications)
      await loadData()
      toast({
        title: "成功",
        description: "角色权限更新成功",
      })
    } catch (error) {
      console.error('更新角色权限失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "更新角色权限失败，请稍后重试",
      })
    }
  }

  const handleUpdateUserPermissions = async (userId: number, applications: number[]) => {
    try {
      await updateUserPermissions(userId, applications)
      await loadData()
      toast({
        title: "成功",
        description: "用户权限更新成功",
      })
    } catch (error) {
      console.error('更新用户权限失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "更新用户权限失败，请稍后重试",
      })
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-[400px]">
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">访问受限</p>
              <p className="text-sm mt-1">您没有权限访问此页面</p>
            </div>
          </CardContent>
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
    <div className="container mx-auto py-8">
      <PageHeader
        title="应用权限管理"
        description="管理教师用户对各个应用的访问权限"
        icon={Settings}
        className="bg-white/50 mb-6"
      />

      <Tabs defaultValue="roles">
        <TabsList className="mb-4">
          <TabsTrigger value="roles">角色权限配置</TabsTrigger>
          <TabsTrigger value="users">用户权限配置</TabsTrigger>
        </TabsList>

        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-6">
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
                onUpdate={handleUpdateRolePermissions}
                appId={user?.tenantId?.toString() || ''}
                onRoleClick={() => {}}
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
                onUpdate={handleUpdateUserPermissions}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
} 