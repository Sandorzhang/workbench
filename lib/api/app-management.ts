import { API_BASE_URL } from './config'
import type { Application } from './auth'

// 导出接口定义
export interface RolePermission {
  id: number
  roleId: string
  roleName: string
  applications: number[]
}

export interface User {
  id: number
  username: string
  name: string
  role: string
  tenantId: number
}

export interface UserPermission {
  id: number
  userId: number
  user: User
  applicationIds: number[]
}

// 获取租户下的所有用户
export async function fetchTenantUsers(tenantId: number) {
  const response = await fetch(`${API_BASE_URL}/users?tenantId=${tenantId}`)
  if (!response.ok) throw new Error('Failed to fetch tenant users')
  return response.json()
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
export async function fetchUserPermissions(tenantId: number): Promise<UserPermission[]> {
  try {
    // 1. 获取所有用户
    const users = await fetchTenantUsers(tenantId)
    
    // 2. 获取用户权限配置
    const response = await fetch(`${API_BASE_URL}/userApplications?tenantId=${tenantId}`)
    if (!response.ok) throw new Error('Failed to fetch user permissions')
    const permissions = await response.json()

    // 3. 为每个用户创建权限记录
    return users
      .filter(user => user.role === 'TEACHER') // 只显示教师用户
      .map(user => {
        const permission = permissions.find((p: any) => p.userId === user.id)
        return {
          id: permission?.id || 0,
          userId: user.id,
          user,
          applicationIds: permission?.applicationIds || [],
          tenantId
        }
      })
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    return []
  }
}

// 更新用户权限配置
export async function updateUserPermissions(userId: number, applications: number[]) {
  try {
    // 1. 获取用户信息和角色权限
    const [userResponse, roleResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/users/${userId}`),
      fetch(`${API_BASE_URL}/rolePermissions`)
    ])

    if (!userResponse.ok || !roleResponse.ok) {
      throw new Error('Failed to fetch required data')
    }

    const user = await userResponse.json()
    const rolePermissions = await roleResponse.json()
    const rolePermission = rolePermissions.find((r: RolePermission) => r.roleId === user.role)

    if (!rolePermission) {
      throw new Error('Role permissions not found')
    }

    // 2. 确保应用权限在角色权限范围内
    const validApplications = applications.filter(appId => 
      rolePermission.applications.includes(appId)
    )

    // 3. 检查是否已有权限记录
    const existingResponse = await fetch(`${API_BASE_URL}/userApplications?userId=${userId}`)
    const existingPermissions = await existingResponse.json()
    const existingPermission = existingPermissions[0]

    if (existingPermission) {
      // 更新现有记录
      const response = await fetch(`${API_BASE_URL}/userApplications/${existingPermission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          applicationIds: validApplications,
          userId,
          tenantId: user.tenantId
        })
      })
      if (!response.ok) throw new Error('Failed to update user permissions')
      return response.json()
    } else {
      // 创建新记录
      const response = await fetch(`${API_BASE_URL}/userApplications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now(), // mock数据需要手动生成id
          userId,
          tenantId: user.tenantId,
          applicationIds: validApplications
        })
      })
      if (!response.ok) throw new Error('Failed to create user permissions')
      return response.json()
    }
  } catch (error) {
    console.error('Error updating user permissions:', error)
    throw error
  }
} 