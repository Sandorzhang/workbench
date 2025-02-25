/**
 * 评估框架详情页面
 * 
 * 功能：
 * 1. 显示单个评估框架的详细信息
 * 2. 展示框架的基本信息（名称、描述、状态等）
 * 3. 展示框架的维度和指标信息
 * 4. 提供编辑框架的入口
 * 5. 处理加载状态和错误状态
 * 
 * 组件结构：
 * - LoadingState: 加载状态展示
 * - ErrorState: 错误状态展示
 * - NotFoundState: 未找到数据状态展示
 * - FrameworkHeader: 框架头部信息
 * - FrameworkContent: 框架主体内容
 * 
 * 使用方式：
 * - 通过动态路由参数 [id] 获取框架数据
 * - 自动处理加载和错误状态
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { AssessmentFramework } from "@/lib/types/assessment"
import { fetchFrameworkById } from "@/lib/api/assessment"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { ROUTES } from '@/lib/constants/routes'

export default function FrameworkDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [framework, setFramework] = useState<AssessmentFramework | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFramework = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchFrameworkById(Number(params.id))
      if (!data) {
        throw new Error('框架不存在')
      }
      setFramework(data)
    } catch (error) {
      console.error('加载框架失败:', error)
      setError(error instanceof Error ? error.message : '加载评估框架失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadFramework()
  }, [loadFramework])

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadFramework} />
  }

  if (!framework) {
    return <NotFoundState />
  }

  return (
    <PageContainer>
      <div className="px-6">
        <FrameworkHeader 
          framework={framework} 
          frameworkId={params.id} 
        />
        <FrameworkContent framework={framework} />
      </div>
    </PageContainer>
  )
}

function LoadingState() {
  return (
    <PageContainer>
      <div className="px-6">
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </PageContainer>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <PageContainer>
      <div className="px-6">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={onRetry}>
            重试
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

function NotFoundState() {
  return (
    <PageContainer>
      <div className="px-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">找不到该评估框架</p>
          <Link href="/dashboard/situational-assessment">
            <Button variant="outline">
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}

function FrameworkHeader({ framework, frameworkId }: { framework: AssessmentFramework; frameworkId: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <PageHeader
        title={framework.name}
        description="评估框架详情"
        icon={Scale}
        showBack
        backUrl="/dashboard/situational-assessment"
      />
      <Link href={ROUTES.ASSESSMENT.FRAMEWORKS.EDIT(frameworkId)}>
        <Button
          className={cn(
            "bg-gradient-to-r from-primary to-primary/90",
            "hover:from-primary/90 hover:to-primary",
            "transition-all duration-300",
            "shadow-lg shadow-primary/20"
          )}
        >
          <Edit className="h-4 w-4 mr-2" />
          编辑框架
        </Button>
      </Link>
    </div>
  )
}

function FrameworkContent({ framework }: { framework: AssessmentFramework }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>基本信息</span>
            <Badge 
              variant={framework.status === "published" ? "default" : "secondary"}
              className={cn(
                framework.status === "published" 
                  ? "bg-primary/10 text-primary"
                  : "bg-muted"
              )}
            >
              {framework.status === 'published' ? '已发布' : '草稿'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {framework.description}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">评估维度</div>
            <div>{framework.dimensions.length} 个</div>
            <div className="text-muted-foreground">创建时间</div>
            <div>{framework.createdAt}</div>
            <div className="text-muted-foreground">更新时间</div>
            <div>{framework.updatedAt}</div>
          </div>
        </CardContent>
      </Card>

      {framework.dimensions.map((dimension) => (
        <Card key={dimension.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{dimension.name}</span>
              <Badge variant="outline">权重 {dimension.weight}%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dimension.indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="p-4 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{indicator.name}</span>
                    <Badge variant="secondary">{indicator.score} 分</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {indicator.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 