/**
 * API 客户端工具
 * 
 * 提供统一的 API 请求方法，处理：
 * - 请求头设置
 * - 错误处理
 * - 响应解析
 * - 认证令牌
 */

import { API_CONFIG } from '../config/api.config';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async request<T>(options: RequestOptions): Promise<T> {
    const { method, url, data, headers = {} } = options;
    
    // 构建完整 URL
    const fullUrl = `${this.baseUrl}${url}`;
    
    // 设置默认请求头
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // 可以在这里添加认证令牌等
    };
    
    try {
      const response = await fetch(fullUrl, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      // 解析响应数据
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}

// 创建 API 客户端实例
export const apiClient = new ApiClient(API_CONFIG.BASE_URL); 