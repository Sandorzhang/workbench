/**
 * 认证相关 API 函数
 */

// 根据环境选择 API 基础 URL
const isDev = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDev ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || '');

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
    const tenantAppResponse = await fetch(`${API_BASE_URL}/api/tenantApplications?tenantId=${user.tenantId}`)
    if (!tenantAppResponse.ok) throw new Error('Failed to fetch tenant applications')
    const tenantAppData = await tenantAppResponse.json()
    const tenantApps = tenantAppData[0]?.applications || []

    // 2. 根据角色判断权限
    if (user.role === 'ADMIN') {
      return tenantApps
    }

    // 3. 获取角色权限
    const roleResponse = await fetch(`${API_BASE_URL}/api/rolePermissions?roleId=${user.role}&tenantId=${user.tenantId}`)
    if (!roleResponse.ok) throw new Error('Failed to fetch role permissions')
    const roleData = await roleResponse.json()
    const rolePermission = roleData[0]

    if (!rolePermission) return []

    // 4. 获取用户个人权限
    const userAppResponse = await fetch(`${API_BASE_URL}/api/userApplications?userId=${user.id}`)
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

/**
 * 认证相关 API 函数
 */

// 登录参数接口
interface LoginParams {
  username: string
  password: string
}

// 手机验证码登录参数接口
interface PhoneLoginParams {
  phone: string
  code: string
}

// 发送验证码参数接口
interface SendCodeParams {
  phone: string
}

// 用户接口
interface User {
  id: string
  name: string
  username: string
  role: string
  avatar: string
}

/**
 * 认证相关 API 函数
 */
export const authApi = {
  /**
   * 账号密码登录
   * @param params 登录参数
   * @returns 用户信息
   */
  login: async (params: LoginParams): Promise<User> => {
    console.log('Sending login request to /api/auth/login', params);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        cache: 'no-store'
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = '登录失败';
        
        try {
          const errorText = await response.text();
          console.error('Login error response text:', errorText);
          
          if (errorText) {
            try {
              const errorObj = JSON.parse(errorText);
              errorMessage = errorObj.error || errorObj.message || '登录失败';
            } catch (parseError) {
              console.error('Error parsing error response:', parseError);
              errorMessage = errorText || '登录失败';
            }
          }
        } catch (readError) {
          console.error('Error reading error response:', readError);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Login successful, user data:', data);
      return data;
    } catch (error) {
      console.error('Login function error:', error);
      throw error;
    }
  },

  /**
   * 手机验证码登录
   * @param params 手机验证码登录参数
   * @returns 用户信息
   */
  loginWithPhone: async (params: PhoneLoginParams): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        let errorMessage = '登录失败';
        
        try {
          const errorText = await response.text();
          
          if (errorText) {
            try {
              const errorObj = JSON.parse(errorText);
              errorMessage = errorObj.error || errorObj.message || '登录失败';
            } catch (parseError) {
              errorMessage = errorText || '登录失败';
            }
          }
        } catch (readError) {
          console.error('Error reading error response:', readError);
        }
        
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      console.error('Phone login error:', error);
      throw error;
    }
  },

  /**
   * 发送验证码
   * @param params 发送验证码参数
   * @returns 发送结果
   */
  sendCode: async (params: SendCodeParams): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        let errorMessage = '发送验证码失败';
        
        try {
          const errorText = await response.text();
          
          if (errorText) {
            try {
              const errorObj = JSON.parse(errorText);
              errorMessage = errorObj.error || errorObj.message || '发送验证码失败';
            } catch (parseError) {
              errorMessage = errorText || '发送验证码失败';
            }
          }
        } catch (readError) {
          console.error('Error reading error response:', readError);
        }
        
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      console.error('Send code error:', error);
      throw error;
    }
  },
  
  /**
   * 退出登录
   */
  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        cache: 'no-store'
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

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