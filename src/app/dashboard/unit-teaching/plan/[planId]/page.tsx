'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileIcon, ArrowLeft } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface TeachingPlan {
  id: number
  unitId: number | null
  name: string
  description: string
  fileUrl: string
  fileType: string
  uploadedAt: string
  createdBy: number
}

export default function PlanDetailPage({ params }: { params: { planId: string } }) {
  const router = useRouter()
  const [plan, setPlan] = useState<TeachingPlan | null>(null)

  useEffect(() => {
    loadData()
  }, [params.planId])

  const loadData = async () => {
    try {
      const response = await fetch(`http://localhost:3100/teachingPlans/${params.planId}`)
      const data = await response.json()
      setPlan(data)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: "获取教案数据失败",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push('/dashboard/unit-teaching')
  }

  if (!plan) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">{plan.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>教案信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">描述</h4>
            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
          </div>
          <div>
            <h4 className="font-medium">文件信息</h4>
            <div className="flex items-center gap-3 mt-2 p-4 border rounded-lg">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">类型：{plan.fileType}</p>
                <p className="text-sm text-muted-foreground">
                  上传时间：{new Date(plan.uploadedAt).toLocaleString()}
                </p>
              </div>
              <Button variant="outline">预览</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 