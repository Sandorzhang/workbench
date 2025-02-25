"use client"

import { toast as sonnerToast } from 'sonner'

// 导出简单的 toast 函数
export const toast = {
  // 基本 toast
  default: (message: string) => sonnerToast(message),
  
  // 带标题和描述的 toast
  custom: ({ title, description, variant }: { 
    title?: string, 
    description?: string, 
    variant?: 'default' | 'destructive' | 'success'
  }) => {
    if (variant === 'destructive') {
      return sonnerToast.error(title, { description });
    } else if (variant === 'success') {
      return sonnerToast.success(title, { description });
    } else {
      return sonnerToast(title, { description });
    }
  }
}

// 为了兼容性，提供一个空的 useToast 函数
export const useToast = () => {
  return { toast };
}

// Toaster 组件
export function Toaster() {
  return null; // 实际上 sonner 会自己处理渲染
} 