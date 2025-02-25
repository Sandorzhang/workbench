/**
 * 学生学术旅程页面
 * 
 * 功能：
 * 1. 展示单个学生的学术发展历程
 * 2. 使用 Suspense 处理异步加载
 * 3. 提供加载状态展示
 * 
 * 组件结构：
 * - 使用 Suspense 包裹主要内容
 * - 使用 LoadingSpinner 作为加载状态
 * - StudentJourneyClient 作为主要内容展示
 * 
 * 使用方式：
 * - 通过动态路由参数 [studentId] 获取学生数据
 * - 自动处理异步加载状态
 */

import { Suspense } from "react"
import StudentJourneyClient from "./student-journey-client"
import { LoadingSpinner } from "@/components/loading-spinner"

interface PageProps {
  params: {
    studentId: string
  }
}

export default function StudentJourneyPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StudentJourneyClient studentId={params.studentId} />
    </Suspense>
  )
} 