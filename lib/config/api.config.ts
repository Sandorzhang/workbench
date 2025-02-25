/**
 * API 配置文件
 * 
 * 功能：
 * 1. 管理所有环境相关的配置（开发环境、生产环境）
 * 2. 提供 API 基础配置（基础URL、版本号、超时时间等）
 * 3. 控制是否使用 Mock 数据
 * 4. 统一管理所有 API 路由
 * 5. 提供 API 端点配置
 * 
 * 使用方式：
 * - 导入 API_CONFIG 来使用配置
 * - 通过环境变量来控制不同环境的配置
 * - 所有 API 路径都在这里集中管理
 */

export const API_CONFIG = {
  // 基础配置
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  
  // API 版本
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 是否使用 Mock 数据
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',

  // 统一的 API 路由配置
  ROUTES: {
    ASSESSMENT: {
      FRAMEWORKS: '/api/frameworks',
      FRAMEWORK_DETAIL: (id: number | string) => `/api/frameworks/${id}`,
      // 暂时注释掉 tasks 相关的路由
      // TASKS: '/api/tasks',
      // TASK_DETAIL: (id: number | string) => `/api/tasks/${id}`,
    },
    ACADEMIC: {
      STUDENTS: '/api/students',
      STUDENT_DETAIL: (id: number | string) => `/api/students/${id}`,
    }
  },
  
  API_ENDPOINTS: {
    ASSESSMENT: {
      BASE: '/assessments',
      FRAMEWORKS: '/frameworks',
      TASKS: '/tasks',
    },
    ACADEMIC: {
      JOURNEY: '/academic-journey',
      STUDENTS: '/students',
    }
  }
} 