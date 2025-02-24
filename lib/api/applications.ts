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
  if (!userRole || !userApps) return []
  return navItems.filter(item => {
    if (item.role && !item.role.includes(userRole)) return false
    if (item.appCode) {
      return userApps.some(app => app.applicationIds.includes(item.appCode))
    }
    return true
  })
}