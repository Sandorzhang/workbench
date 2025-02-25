import { API_BASE_URL } from './config'

interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
}

export async function fetchUserApplications(): Promise<Application[]> {
  const userStr = localStorage.getItem('user')
  if (!userStr) throw new Error('User not found')
  
  const user = JSON.parse(userStr)
  
  try {
    // 1. 获取租户的所有应用（确定最大权限集合）
    const tenantAppResponse = await fetch(`http://localhost:3100/tenantApplications?tenantId=${user.tenantId}`)
    if (!tenantAppResponse.ok) throw new Error('Failed to fetch tenant applications')
    const tenantAppData = await tenantAppResponse.json()
    const tenantApps = tenantAppData[0]?.applications || []

    // 2. 根据角色判断权限
    if (user.role === 'ADMIN') {
      // 管理员直接返回租户所有应用
      return tenantApps
    }

    // 3. 教师需要检查个人权限集合
    if (user.role === 'TEACHER') {
      const userAppResponse = await fetch(`http://localhost:3100/userApplications?userId=${user.id}`)
      if (!userAppResponse.ok) throw new Error('Failed to fetch user applications')
      const userAppData = await userAppResponse.json()
      const userApp = userAppData[0]

      // 如果没有权限配置，返回空数组
      if (!userApp) return []

      // 返回用户被分配的应用
      return tenantApps.filter(app => userApp.applicationIds.includes(app.id))
    }

    return []
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
} 