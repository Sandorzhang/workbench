'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { AssessmentFramework } from "@/lib/types/assessment"
import { fetchFrameworks } from "@/lib/api/assessment"
import Link from "next/link"

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<AssessmentFramework[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFrameworks()
  }, [])

  const loadFrameworks = async () => {
    try {
      const data = await fetchFrameworks()
      setFrameworks(data)
    } catch (error) {
      console.error('加载框架失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title="测评框架"
          description="管理情境化测评的评估框架"
          icon={Scale}
          className="mb-6"
          action={
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                size="sm"
                className={cn(
                  "bg-white/50 hover:bg-white/80",
                  "transition-all duration-300"
                )}
              >
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
              <Link href="/dashboard/situational-assessment/frameworks/create">
                <Button
                  className={cn(
                    "bg-gradient-to-r from-primary to-primary/90",
                    "hover:from-primary/90 hover:to-primary",
                    "transition-all duration-300",
                    "shadow-lg shadow-primary/20"
                  )}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新建框架
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((framework) => (
            <Link 
              href={`/dashboard/situational-assessment/frameworks/${framework.id}`}
              key={framework.id}
            >
              <Card className={cn(
                "transition-all duration-200",
                "hover:shadow-md hover:-translate-y-0.5",
                "bg-white/70 backdrop-blur-sm border-white/50"
              )}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{framework.name}</span>
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
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {framework.description}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">评估维度</div>
                    <div>{framework.dimensions.length} 个</div>
                    <div className="text-muted-foreground">更新时间</div>
                    <div>{framework.updatedAt}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  )
} 