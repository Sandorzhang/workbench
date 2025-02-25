import { API_BASE_URL } from './config'

export interface Application {
  id: number
  code: string
  name: string
  description: string
  icon: string
  adminOnly?: boolean
}

export async function fetchUserApplications(): Promise<Application[]> {
  const userStr = localStorage.getItem('user')
  if (!userStr) throw new Error('User not found')
  
  const user = JSON.parse(userStr)
  
  try {
    // 1. 获取租户的所有应用
    const tenantAppResponse = await fetch(`http://localhost:3100/api/tenantApplications?tenantId=${user.tenantId}`)
    if (!tenantAppResponse.ok) throw new Error('Failed to fetch tenant applications')
    const tenantAppData = await tenantAppResponse.json()
    const tenantApps = tenantAppData[0]?.applications || []

    // 2. 根据角色判断权限
    if (user.role === 'ADMIN') {
      return tenantApps
    }

    // 3. 获取角色权限
    const roleResponse = await fetch(`http://localhost:3100/api/rolePermissions?roleId=${user.role}&tenantId=${user.tenantId}`)
    if (!roleResponse.ok) throw new Error('Failed to fetch role permissions')
    const roleData = await roleResponse.json()
    const rolePermission = roleData[0]

    if (!rolePermission) return []

    // 4. 获取用户个人权限
    const userAppResponse = await fetch(`http://localhost:3100/api/userApplications?userId=${user.id}`)
    if (!userAppResponse.ok) throw new Error('Failed to fetch user applications')
    const userAppData = await userAppResponse.json()
    const userApp = userAppData[0]

    // 过滤掉管理员专属应用
    const nonAdminApps = tenantApps.filter(app => !app.adminOnly)

    // 如果没有个人权限配置，使用角色权限
    if (!userApp) {
      return nonAdminApps.filter(app => rolePermission.applications.includes(app.id))
    }

    // 5. 用户权限必须在角色权限范围内
    const allowedApps = userApp.applicationIds.filter(appId => 
      rolePermission.applications.includes(appId)
    )

    return nonAdminApps.filter(app => allowedApps.includes(app.id))
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
}

interface LoginParams {
  username: string
  password: string
}

interface PhoneLoginParams {
  phone: string
  code: string
}

interface SendCodeParams {
  phone: string
}

export const authApi = {
  // 账号密码登录
  login: async (params: LoginParams) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '登录失败')
    }
    
    return response.json()
  },

  // 手机验证码登录
  loginWithPhone: async (params: PhoneLoginParams) => {
    const response = await fetch(`${API_BASE_URL}/auth/login-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
    
    return response.json()
  },

  // 发送验证码
  sendCode: async (params: SendCodeParams) => {
    const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
    
    return response.json()
  }
}

// 登录函数
export async function login(username: string, password: string) {
  try {
    console.log(`Attempting to login with username: ${username}`);
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      cache: 'no-store'
    });
    
    console.log(`Login response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login error response:', errorData);
      throw new Error(errorData.error || '登录失败');
    }
    
    const userData = await response.json();
    console.log('Login successful, user data received');
    return userData;
  } catch (error) {
    console.error('Login function error:', error);
    throw error;
  }
} 