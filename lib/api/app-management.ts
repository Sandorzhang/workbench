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
  const response = await fetch(`${API_BASE_URL}/userApplications/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationIds: applications })
  })
  if (!response.ok) throw new Error('Failed to update user permissions')
  return response.json()
} 