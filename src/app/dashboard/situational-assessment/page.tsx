/**
 * 情境评估首页
 * 
 * 功能：
 * 1. 展示评估框架列表
 * 2. 提供创建入口
 */

'use client'

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssessmentFramework } from "@/lib/types/assessment"
import { fetchFrameworks } from "@/lib/api/assessment"
import { Button } from "@/components/ui/button"
import { Plus, Scale } from "lucide-react"
import Link from "next/link"
import { ROUTES } from '@/lib/constants/routes'

export default function SituationalAssessmentPage() {
  const [frameworks, setFrameworks] = useState<AssessmentFramework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFrameworks()
  }, [])

  const loadFrameworks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchFrameworks()
      setFrameworks(data)
    } catch (error) {
      console.error('加载框架失败:', error)
      setError('加载评估框架失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <PageContainer>
        <div className="px-6">
          <div className="text-center py-8 text-destructive">
            {error}
            <Button
              variant="outline"
              onClick={loadFrameworks}
              className="ml-4"
            >
              重试
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="情境评估"
            description="管理评估框架和任务"
            icon={Scale}
          />
          <div className="flex items-center space-x-4">
            <Link href={ROUTES.ASSESSMENT.FRAMEWORKS.CREATE}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                创建框架
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="frameworks">
          <TabsList>
            <TabsTrigger value="frameworks">评估框架</TabsTrigger>
          </TabsList>

          <TabsContent value="frameworks" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((framework) => (
                <Link 
                  key={framework.id}
                  href={ROUTES.ASSESSMENT.FRAMEWORKS.DETAIL(framework.id)}
                >
                  <div className="group relative p-6 rounded-lg border hover:border-primary transition-colors">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {framework.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {framework.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      <span>{framework.dimensions.length} 个维度</span>
                      <span className="mx-2">•</span>
                      <span>
                        {framework.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 