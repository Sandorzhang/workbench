/**
 * 应用详情页面
 * 
 * 功能：
 * 1. 展示应用基本信息
 * 2. 管理应用权限
 * 3. 展示用户权限列表
 */

'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { ROUTES } from '@/lib/constants/routes'
import { UserPermissionTable } from '../user-permission-table'
import { RolePermissionTable } from '../role-permission-table'

interface AppDetailPageProps {
  params: {
    id: string
  }
}

export default function AppDetailPage({ params }: AppDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')
  const [appInfo, setAppInfo] = useState<any>(null)

  useEffect(() => {
    // 加载应用信息
    loadAppInfo(params.id)
  }, [params.id])

  const loadAppInfo = async (appId: string) => {
    // 实现加载应用信息的逻辑
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

        {activeTab === 'users' ? (
          <UserPermissionTable appId={params.id} />
        ) : (
          <RolePermissionTable 
            appId={params.id}
            onRoleClick={(roleId) => {
              // 使用新的路由跳转到角色详情
              window.location.href = ROUTES.APP_MANAGEMENT.ROLES.DETAIL(roleId)
            }}
          />
        )}
      </div>
    </PageContainer>
  )
} 