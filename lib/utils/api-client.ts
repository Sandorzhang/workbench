/**
 * API 客户端工具类
 * 
 * 功能：
 * 1. 提供统一的 API 请求客户端
 * 2. 处理请求和响应拦截
 * 3. 统一的错误处理
 * 4. 支持认证信息的自动添加
 * 5. 处理请求超时
 * 
 * 主要特性：
 * - 基于 axios 的封装
 * - 支持请求拦截器（添加认证信息等）
 * - 支持响应拦截器（统一错误处理）
 * - 支持请求超时配置
 * - 统一的请求方法
 * 
 * 使用方式：
 * - 导入 apiClient 实例
 * - 使用 request 方法发送请求
 * - 自动处理认证和错误
 */

import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // 创建 axios 实例
    this.client = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在这里可以添加认证信息等
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // 统一错误处理
        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      return await this.client.request<any, T>(config);
    } catch (error) {
      // 错误处理逻辑
      throw error;
    }
  }
}

export const apiClient = new ApiClient(); 