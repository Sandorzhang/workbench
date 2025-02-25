'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileIcon, ArrowLeft, Download } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface TeachingPlan {
  id: number
  unitId: number
  name: string
  description: string
  fileUrl: string
  fileType: string
  uploadedAt: string
  createdBy: number
  content?: {
    objectives: string[]
    keyPoints: string[]
    teachingProcess: {
      stage: string
      duration: string
      activities: string[]
      materials: string[]
    }[]
    homework: string[]
    reflection: string
  }
}

interface PageProps {
  params: Promise<{ unitId: string; planId: string }>
}

export default function PlanDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [plan, setPlan] = useState<TeachingPlan | null>(null)

  useEffect(() => {
    loadData()
  }, [resolvedParams.unitId, resolvedParams.planId])

  const loadData = async () => {
    try {
      const unitId = parseInt(resolvedParams.unitId, 10)
      const planId = parseInt(resolvedParams.planId, 10)
      console.log('Loading plan:', { unitId, planId })
      
      const response = await fetch(`http://localhost:3100/teachingPlans/${planId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch plan: ${response.status}`)
      }
      const data = await response.json()
      setPlan(data)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "获取教案数据失败",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/unit-teaching/unit/${resolvedParams.unitId}`)
  }

  if (!plan) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{plan.name}</h1>
            <p className="text-muted-foreground">
              上传时间：{new Date(plan.uploadedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          下载教案
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">教案描述</h3>
            <p className="text-sm">{plan.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">文件类型</h3>
              <p className="text-sm uppercase">{plan.fileType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">文件大小</h3>
              <p className="text-sm">--</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {plan.content && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>教学目标</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {plan.content.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{objective}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>教学重点</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {plan.content.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>教学过程</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {plan.content.teachingProcess.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{stage.stage}</h3>
                    <span className="text-sm text-muted-foreground">{stage.duration}</span>
                  </div>
                  <div className="pl-4 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">教学活动</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {stage.activities.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">{activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">教学资源</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {stage.materials.map((material, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">{material}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>课后作业</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {plan.content.homework.map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>教学反思</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {plan.content.reflection}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 