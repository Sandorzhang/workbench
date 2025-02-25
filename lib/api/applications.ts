export async function getUserApplications(userId: string) {
  if (!userId) return []
  
  const response = await fetch(`/api/user-applications?userId=${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user applications")
  }
  return response.json()
}

export function filterNavItemsByPermission(
  navItems: any[],
  userRole?: string,
  userApps?: any[]
) {
  if (!userRole) return []
  
  // 管理员可以访问所有导航项
  if (userRole === 'ADMIN') return navItems
  
  // 教师根据分配的应用权限过滤
  if (userRole === 'TEACHER' && userApps) {
    return navItems.filter(item => {
      if (!item.appCode) return true
      return userApps.some(app => app.code === item.appCode)
    })
  }
  
  return []
}