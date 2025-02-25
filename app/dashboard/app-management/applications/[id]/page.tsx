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

interface AppDetailPageProps {
  params: {
    id: string
  }
}

export default function AppDetailPage({ params }: AppDetailPageProps) {
  // ... 组件内容保持不变
} 