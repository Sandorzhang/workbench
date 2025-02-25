import { AssessmentFramework, CreateFrameworkDto, UpdateFrameworkDto } from "../types/assessment"
// import { AssessmentTask, CreateTaskDto } from "../types/assessment"
import { apiClient } from '../utils/api-client';
import { API_CONFIG } from '../config/api.config';

/**
 * 评估相关的 API 实现文件
 * 
 * 功能：
 * 1. 实现所有评估相关的 API 请求方法
 * 2. 处理 Mock 数据和真实 API 的切换
 * 3. 提供评估框架的 CRUD 操作
 * 4. 提供评估任务的 CRUD 操作
 * 
 * 主要方法：
 * - fetchFrameworks: 获取所有评估框架
 * - fetchFrameworkById: 获取单个评估框架
 * - createFramework: 创建评估框架
 * - updateFramework: 更新评估框架
 * - fetchTasks: 获取所有评估任务
 * - fetchTaskById: 获取单个评估任务
 * - createTask: 创建评估任务
 * - updateTask: 更新评估任务
 * 
 * 使用方式：
 * - 直接导入需要的方法
 * - 也可以使用 AssessmentApi 类的静态方法
 */

// 获取框架列表
export async function fetchFrameworks(): Promise<AssessmentFramework[]> {
  if (API_CONFIG.USE_MOCK) {
    // 使用 mock 数据
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORKS}`);
    return response.json();
  }

  // 使用真实 API
  return apiClient.request<AssessmentFramework[]>({
    method: 'GET',
    url: API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORKS,
  });
}

// 获取单个框架
export async function fetchFrameworkById(id: number): Promise<AssessmentFramework | null> {
  if (API_CONFIG.USE_MOCK) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORK_DETAIL(id)}`);
    return response.json();
  }

  return apiClient.request<AssessmentFramework>({
    method: 'GET',
    url: API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORK_DETAIL(id),
  });
}

// 创建框架
export async function createFramework(data: CreateFrameworkDto): Promise<AssessmentFramework | null> {
  if (API_CONFIG.USE_MOCK) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORKS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  return apiClient.request<AssessmentFramework>({
    method: 'POST',
    url: API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORKS,
    data: data,
  });
}

// 更新框架
export async function updateFramework(
  id: number, 
  data: UpdateFrameworkDto
): Promise<AssessmentFramework | null> {
  if (API_CONFIG.USE_MOCK) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORK_DETAIL(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  return apiClient.request<AssessmentFramework>({
    method: 'PUT',
    url: API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORK_DETAIL(id),
    data: data,
  });
}

export class AssessmentApi {
  // 获取评估框架列表
  static async getFrameworks(): Promise<AssessmentFramework[]> {
    if (API_CONFIG.USE_MOCK) {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORKS}`);
      return response.json();
    }

    return apiClient.request<AssessmentFramework[]>({
      method: 'GET',
      url: API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORKS,
    });
  }

  // 获取单个评估框架详情
  static async getFramework(id: string | number): Promise<AssessmentFramework> {
    const url = API_CONFIG.ROUTES.ASSESSMENT.FRAMEWORK_DETAIL(id);
    
    if (API_CONFIG.USE_MOCK) {
      const response = await fetch(`${API_CONFIG.BASE_URL}${url}`);
      return response.json();
    }

    return apiClient.request<AssessmentFramework>({
      method: 'GET',
      url,
    });
  }

  // 注释掉任务相关的方法
  /*
  static async createTask(task: Partial<AssessmentTask>): Promise<AssessmentTask> { ... }
  */
} 