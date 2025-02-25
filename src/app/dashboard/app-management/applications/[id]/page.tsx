/**
 * 应用详情页面
 */

'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { ROUTES } from '@/lib/constants/routes'
import { UserPermissionTable } from '../../user-permission-table'
import { RolePermissionTable } from '../../role-permission-table'
import { 
  fetchAppInfo, 
  fetchApplicationRolePermissions,
  updateApplicationRolePermissions,
  type AppInfo,
  type RolePermission 
} from '@/lib/api/app-management'
import { toast } from "@/components/ui/use-toast"

interface AppDetailPageProps {
  params: {
    id: string
  }
}

export default function AppDetailPage({ params }: AppDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAppInfo(params.id)
    loadRolePermissions(params.id)
  }, [params.id])

  const loadAppInfo = async (appId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchAppInfo(appId)
      setAppInfo(data)
    } catch (error) {
      console.error('加载应用信息失败:', error)
      setError('加载应用信息失败，请稍后重试')
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载应用信息失败，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadRolePermissions = async (appId: string) => {
    try {
      const data = await fetchApplicationRolePermissions(appId)
      setRolePermissions(data)
    } catch (error) {
      console.error('加载角色权限失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载角色权限失败，请稍后重试",
      })
    }
  }

  const handleUpdateRolePermissions = async (roleId: string, applications: number[]) => {
    try {
      await updateApplicationRolePermissions(params.id, roleId, applications)
      // 重新加载角色权限数据
      await loadRolePermissions(params.id)
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

  if (error) {
    return (
      <PageContainer>
        <div className="px-6">
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title={appInfo?.name || '应用详情'}
          description="管理应用权限"
          showBack
          backUrl={ROUTES.APP_MANAGEMENT.ROOT}
        />

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : ''}`}
          >
            用户权限
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 ${activeTab === 'roles' ? 'text-primary border-b-2 border-primary' : ''}`}
          >
            角色权限
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          activeTab === 'users' ? (
            <UserPermissionTable appId={params.id} />
          ) : (
            <RolePermissionTable 
              appId={params.id}
              data={rolePermissions}
              onRoleClick={(roleId) => {
                window.location.href = ROUTES.APP_MANAGEMENT.ROLES.DETAIL(roleId)
              }}
              onUpdate={handleUpdateRolePermissions}
            />
          )
        )}
      </div>
    </PageContainer>
  )
} 