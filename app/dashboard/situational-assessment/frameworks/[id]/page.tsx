'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, Edit, FileBarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { AssessmentFramework } from "@/lib/types/assessment"
import { fetchFrameworkById } from "@/lib/api/assessment"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function FrameworkDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [framework, setFramework] = useState<AssessmentFramework | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFramework()
  }, [params.id])

  const loadFramework = async () => {
    try {
      const data = await fetchFrameworkById(Number(params.id))
      setFramework(data)
    } catch (error) {
      console.error('加载框架失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    )
  }

  if (!framework) {
    return (
      <PageContainer>
        <div className="text-center py-8">
          <p className="text-muted-foreground">未找到框架数据</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title={framework.name}
          description={framework.description}
          icon={Scale}
          className="mb-6"
          showBack
          backUrl="/dashboard/situational-assessment/frameworks"
          action={
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/situational-assessment/frameworks/${params.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                编辑框架
              </Button>
              <Button
                className={cn(
                  "bg-gradient-to-r from-primary to-primary/90",
                  "hover:from-primary/90 hover:to-primary",
                  "transition-all duration-300",
                  "shadow-lg shadow-primary/20"
                )}
              >
                <FileBarChart className="h-4 w-4 mr-2" />
                生成报告
              </Button>
            </div>
          }
        />

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">评估维度</div>
                  <div className="mt-1">{framework.dimensions.length} 个</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">指标总数</div>
                  <div className="mt-1">
                    {framework.dimensions.reduce((sum, dim) => sum + dim.indicators.length, 0)} 个
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">创建时间</div>
                  <div className="mt-1">{framework.createdAt}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">更新时间</div>
                  <div className="mt-1">{framework.updatedAt}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {framework.dimensions.map((dimension, index) => (
            <Card key={dimension.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>维度 {index + 1}：{dimension.name}</span>
                  <Badge variant="outline">权重 {dimension.weight}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {dimension.indicators.map((indicator) => (
                    <div key={indicator.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{indicator.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {indicator.score} 分
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {indicator.description}
                      </div>
                      <Progress value={indicator.score} max={100} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  )
} 