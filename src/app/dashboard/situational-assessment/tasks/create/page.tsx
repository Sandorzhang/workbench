/**
 * 创建评估任务页面
 * 
 * 功能：
 * 1. 提供创建新评估任务的表单
 * 2. 选择评估框架
 * 3. 填写任务基本信息
 * 
 * 使用方式：
 * - 通过路由 /dashboard/situational-assessment/tasks/create 访问
 */

'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ROUTES } from '@/lib/constants/routes'
import { fetchFrameworks } from "@/lib/api/assessment"
import type { AssessmentFramework } from "@/lib/types/assessment"

export default function CreateTaskPage() {
  const router = useRouter()
  const [frameworks, setFrameworks] = useState<AssessmentFramework[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFrameworks()
  }, [])

  const loadFrameworks = async () => {
    try {
      const data = await fetchFrameworks()
      setFrameworks(data)
    } catch (error) {
      console.error('加载框架失败:', error)
      setError('加载评估框架失败，请稍后重试')
    }
  }

  const handleSubmit = async () => {
    // 暂时只做路由跳转
    router.push(ROUTES.ASSESSMENT.TASKS.LIST)
  }

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title="创建评估任务"
          description="创建新的评估任务"
          showBack
          backUrl={ROUTES.ASSESSMENT.TASKS.LIST}
        />
        <Card>
          <CardContent className="pt-6">
            {/* 表单内容暂时移除 */}
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>
                创建任务
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 