/**
 * API 配置文件
 * 
 * 用于集中管理 API 相关的配置信息，包括：
 * - 基础 URL
 * - API 路由
 * - 是否使用 Mock 数据
 * - 超时设置
 * - 重试策略
 */

export const API_CONFIG = {
  // 基础 URL，用于构建完整的 API 请求地址
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // 是否使用 Mock 数据
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true,
  
  // API 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // API 路由配置
  ROUTES: {
    // 评估相关路由
    ASSESSMENT: {
      // 评估框架相关
      FRAMEWORKS: '/api/assessment/frameworks',
      FRAMEWORK_DETAIL: (id: string | number) => `/api/assessment/frameworks/${id}`,
      
      // 评估任务相关
      TASKS: '/api/assessment/tasks',
      TASK_DETAIL: (id: string | number) => `/api/assessment/tasks/${id}`,
    },
    
    // 其他 API 路由可以在这里添加
  }
}; 