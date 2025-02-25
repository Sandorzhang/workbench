/**
 * 应用管理相关的 API
 * 
 * 功能：
 * 1. 获取应用信息
 * 2. 获取角色权限
 * 3. 更新角色权限
 * 4. 管理用户权限
 */

import { API_CONFIG } from '../config/api.config'
import { apiClient } from '../utils/api-client'
import type { Application } from '@/lib/api/auth'

// 应用信息类型
export interface AppInfo {
  id: number
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 角色权限类型
export interface RolePermission {
  id: number
  roleId: string
  roleName: string
  applications: number[]
}

// 用户类型
export interface User {
  id: number
  username: string
  name: string
  role: string
  tenantId: number
}

// 用户权限类型
export interface UserPermission {
  id: number
  userId: number
  user: User
  applicationIds: number[]
}

// 获取租户下的所有用户
export async function fetchTenantUsers(tenantId: number): Promise<User[]> {
  if (API_CONFIG.USE_MOCK) {
    return apiClient.request<User[]>({
      method: 'GET',
      url: API_CONFIG.ROUTES.APP_MANAGEMENT.USERS,
      params: { tenantId }
    })
  }

  return apiClient.request<User[]>({
    method: 'GET',
    url: '/users',
    params: { tenantId }
  })
}

// 获取租户的角色权限配置
export async function fetchTenantRolePermissions(tenantId: number): Promise<RolePermission[]> {
  if (API_CONFIG.USE_MOCK) {
    return apiClient.request<RolePermission[]>({
      method: 'GET',
      url: API_CONFIG.ROUTES.APP_MANAGEMENT.ROLE_PERMISSIONS,
      params: { tenantId }
    })
  }

  return apiClient.request<RolePermission[]>({
    method: 'GET',
    url: '/role-permissions',
    params: { tenantId }
  })
}

// 获取应用的角色权限列表
export async function fetchApplicationRolePermissions(appId: string): Promise<RolePermission[]> {
  if (API_CONFIG.USE_MOCK) {
    return apiClient.request<RolePermission[]>({
      method: 'GET',
      url: `${API_CONFIG.ROUTES.APP_MANAGEMENT.APPLICATIONS}/${appId}/role-permissions`
    })
  }

  return apiClient.request<RolePermission[]>({
    method: 'GET',
    url: `/applications/${appId}/role-permissions`
  })
}

// 更新租户的角色权限配置
export async function updateTenantRolePermissions(
  tenantId: number, 
  roleId: string, 
  applications: number[]
): Promise<RolePermission> {
  // 获取所有应用列表
  const tenantApps = await apiClient.request<{ applications: Application[] }[]>({
    method: 'GET',
    url: API_CONFIG.ROUTES.APP_MANAGEMENT.TENANT_APPLICATIONS,
    params: { tenantId }
  })

  const allApps = tenantApps[0]?.applications || []

  // 如果不是管理员角色，过滤掉管理员专属应用
  if (roleId !== 'ADMIN') {
    const nonAdminApps = allApps
      .filter(app => !app.adminOnly)
      .map(app => app.id)
    applications = applications.filter(appId => nonAdminApps.includes(appId))
  }

  // 获取当前角色权限记录
  const [rolePermission] = await apiClient.request<RolePermission[]>({
    method: 'GET',
    url: API_CONFIG.ROUTES.APP_MANAGEMENT.ROLE_PERMISSIONS,
    params: { roleId, tenantId }
  })

  // 更新权限记录
  return apiClient.request<RolePermission>({
    method: 'PATCH',
    url: `${API_CONFIG.ROUTES.APP_MANAGEMENT.ROLE_PERMISSIONS}/${rolePermission.id}`,
    data: { applications }
  })
}

// 获取用户权限配置
export async function fetchUserPermissions(tenantId: number): Promise<UserPermission[]> {
  try {
    // 1. 获取所有用户
    const users = await fetchTenantUsers(tenantId)
    
    // 2. 获取所有应用和权限记录
    const [tenantApps, userPermissions] = await Promise.all([
      apiClient.request<{ applications: Application[] }[]>({
        method: 'GET',
        url: API_CONFIG.ROUTES.APP_MANAGEMENT.TENANT_APPLICATIONS,
        params: { tenantId }
      }),
      apiClient.request<UserPermission[]>({
        method: 'GET',
        url: API_CONFIG.ROUTES.APP_MANAGEMENT.USER_PERMISSIONS,
        params: { tenantId }
      })
    ])

    const allApps = tenantApps[0]?.applications || []

    // 3. 为每个用户创建权限记录
    return users
      .filter(user => user.role === 'TEACHER') // 只显示教师用户
      .map(user => {
        const permission = userPermissions.find(p => p.userId === user.id)
        return {
          id: permission?.id || 0,
          userId: user.id,
          user,
          applicationIds: permission?.applicationIds || []
        }
      })
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    throw error
  }
}

// 更新用户权限配置
export async function updateUserPermissions(
  userId: number, 
  applications: number[]
): Promise<UserPermission> {
  try {
    // 1. 获取用户信息和角色权限
    const [user, rolePermissions, tenantApps] = await Promise.all([
      apiClient.request<User>({
        method: 'GET',
        url: `${API_CONFIG.ROUTES.APP_MANAGEMENT.USERS}/${userId}`
      }),
      apiClient.request<RolePermission[]>({
        method: 'GET',
        url: API_CONFIG.ROUTES.APP_MANAGEMENT.ROLE_PERMISSIONS
      }),
      apiClient.request<{ applications: Application[] }[]>({
        method: 'GET',
        url: API_CONFIG.ROUTES.APP_MANAGEMENT.TENANT_APPLICATIONS
      })
    ])

    const allApps = tenantApps[0]?.applications || []
    const rolePermission = rolePermissions.find(r => r.roleId === user.role)

    if (!rolePermission) {
      throw new Error('Role permissions not found')
    }

    // 2. 确保应用权限在角色权限范围内，并过滤掉管理员专属应用
    const validApplications = applications.filter(appId => 
      rolePermission.applications.includes(appId) && 
      !allApps.find(app => app.id === appId && app.adminOnly)
    )

    // 3. 检查是否已有权限记录
    const [existingPermission] = await apiClient.request<UserPermission[]>({
      method: 'GET',
      url: API_CONFIG.ROUTES.APP_MANAGEMENT.USER_PERMISSIONS,
      params: { userId }
    })

    if (existingPermission) {
      // 更新现有记录
      return apiClient.request<UserPermission>({
        method: 'PATCH',
        url: `${API_CONFIG.ROUTES.APP_MANAGEMENT.USER_PERMISSIONS}/${existingPermission.id}`,
        data: {
          applicationIds: validApplications,
          userId,
          tenantId: user.tenantId
        }
      })
    } else {
      // 创建新记录
      return apiClient.request<UserPermission>({
        method: 'POST',
        url: API_CONFIG.ROUTES.APP_MANAGEMENT.USER_PERMISSIONS,
        data: {
          userId,
          tenantId: user.tenantId,
          applicationIds: validApplications
        }
      })
    }
  } catch (error) {
    console.error('Error updating user permissions:', error)
    throw error
  }
}

// 获取应用信息
export async function fetchAppInfo(appId: string): Promise<AppInfo> {
  if (API_CONFIG.USE_MOCK) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/applications/${appId}`)
    return response.json()
  }

  return apiClient.request<AppInfo>({
    method: 'GET',
    url: `/applications/${appId}`,
  })
}

// 获取角色权限列表
export async function fetchRolePermissions(appId: string): Promise<RolePermission[]> {
  if (API_CONFIG.USE_MOCK) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/applications/${appId}/role-permissions`)
    return response.json()
  }

  return apiClient.request<RolePermission[]>({
    method: 'GET',
    url: `/applications/${appId}/role-permissions`,
  })
}

// 更新应用的角色权限
export async function updateApplicationRolePermissions(
  appId: string,
  roleId: string,
  applications: number[]
): Promise<RolePermission> {
  if (API_CONFIG.USE_MOCK) {
    return apiClient.request<RolePermission>({
      method: 'PUT',
      url: `${API_CONFIG.ROUTES.APP_MANAGEMENT.APPLICATIONS}/${appId}/role-permissions/${roleId}`,
      data: { applications }
    })
  }

  return apiClient.request<RolePermission>({
    method: 'PUT',
    url: `/applications/${appId}/role-permissions/${roleId}`,
    data: { applications }
  })
} 