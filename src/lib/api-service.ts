/**
 * API Service
 * 
 * 提供统一的API服务接口，用于处理所有后端数据请求
 */

import { API_CONFIG } from './config/api.config';

interface Student {
  id: number;
  name: string;
  studentId: string;
  gender: 'male' | 'female';
  grade: string;
  class: string;
  guardianName: string;
  guardianPhone: string;
  status: 'active' | 'inactive';
  tenantId: number;
  address?: string;
  enrollmentDate?: string;
}

interface Class {
  id: number;
  name: string;
  grade: string;
  headTeacherId: number;
  studentCount: number;
  tenantId: number;
}

export class ApiService {
  // 获取学生列表
  static async getStudents(tenantId: number): Promise<Student[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/students?tenantId=${tenantId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  }

  // 创建学生
  static async createStudent(data: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create student');
    }
    
    return response.json();
  }

  // 删除学生
  static async deleteStudent(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/students/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  }

  // 获取班级列表
  static async getClasses(tenantId: number): Promise<Class[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/classes?tenantId=${tenantId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch classes');
    }
    return response.json();
  }
} 