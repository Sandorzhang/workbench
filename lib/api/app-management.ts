import { API_BASE_URL } from './config'

// 导出接口定义
export interface RolePermission {
  id: number
  roleId: string
  roleName: string
  applications: number[]
}

export interface UserPermission {
  id: number
  userId: number
  userName: string
  applicationIds: number[]
}

// 获取角色权限配置
export async function fetchRolePermissions(tenantId: number) {
  const response = await fetch(`${API_BASE_URL}/rolePermissions?tenantId=${tenantId}`)
  if (!response.ok) throw new Error('Failed to fetch role permissions')
  return response.json()
}

// 更新角色权限配置
export async function updateRolePermissions(tenantId: number, roleId: string, applications: number[]) {
  // 获取所有应用列表
  const tenantAppResponse = await fetch(`${API_BASE_URL}/tenantApplications?tenantId=${tenantId}`)
  if (!tenantAppResponse.ok) throw new Error('Failed to fetch tenant applications')
  const tenantAppData = await tenantAppResponse.json()
  const allApps = tenantAppData[0]?.applications || []

  // 如果不是管理员角色，过滤掉管理员专属应用
  if (roleId !== 'ADMIN') {
    const nonAdminApps = allApps.filter(app => !app.adminOnly).map(app => app.id)
    applications = applications.filter(appId => nonAdminApps.includes(appId))
  }

  // 先获取当前角色权限记录
  const response = await fetch(`${API_BASE_URL}/rolePermissions?roleId=${roleId}&tenantId=${tenantId}`)
  if (!response.ok) throw new Error('Failed to fetch role permission')
  const [rolePermission] = await response.json()

  // 更新权限记录
  const updateResponse = await fetch(`${API_BASE_URL}/rolePermissions/${rolePermission.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applications })
  })
  if (!updateResponse.ok) throw new Error('Failed to update role permissions')
  return updateResponse.json()
}

// 获取用户权限配置
export async function fetchUserPermissions(tenantId: number) {
  const response = await fetch(`${API_BASE_URL}/userApplications?tenantId=${tenantId}`)
  if (!response.ok) throw new Error('Failed to fetch user permissions')
  return response.json()
}

// 更新用户权限配置
export async function updateUserPermissions(userId: number, applications: number[]) {
  // 获取用户信息和所有应用列表
  const [userResponse, tenantAppResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/users/${userId}`),
    fetch(`${API_BASE_URL}/tenantApplications`)
  ])

  if (!userResponse.ok || !tenantAppResponse.ok) {
    throw new Error('Failed to fetch required data')
  }

  const user = await userResponse.json()
  const tenantAppData = await tenantAppResponse.json()
  const allApps = tenantAppData[0]?.applications || []

  // 如果不是管理员用户，过滤掉管理员专属应用
  if (user.role !== 'ADMIN') {
    const nonAdminApps = allApps.filter(app => !app.adminOnly).map(app => app.id)
    applications = applications.filter(appId => nonAdminApps.includes(appId))
  }

  const response = await fetch(`${API_BASE_URL}/userApplications/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationIds: applications })
  })
  if (!response.ok) throw new Error('Failed to update user permissions')
  return response.json()
} 