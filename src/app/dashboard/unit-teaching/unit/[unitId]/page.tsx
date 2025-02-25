'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileIcon, ArrowLeft, Plus } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { KnowledgeStructure } from "@/components/unit-teaching/knowledge-structure"

interface TeachingUnit {
  id: number
  name: string
  subject: string
  grade: string
  description: string
  createdAt: string
  teacherId: number
  analysis: {
    standards: string[]
    teachingGoals: string[]
    prerequisites: string[]
    materials: string[]
    competencies: {
      knowledge: boolean
      skills: boolean
      emotions: boolean
      spaceAwareness: boolean
      logicalThinking: boolean
      practicalAbility: boolean
      innovation: boolean
    }
    content: {
      overview: string
      learningObjectives: string
    }
  }
}

interface TeachingPlan {
  id: number
  unitId: number
  name: string
  description: string
  fileUrl: string
  fileType: string
  uploadedAt: string
  createdBy: number
}

interface PageProps {
  params: Promise<{ unitId: string }>
}

export default function UnitDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [unit, setUnit] = useState<TeachingUnit | null>(null)
  const [plans, setPlans] = useState<TeachingPlan[]>([])

  useEffect(() => {
    loadData()
  }, [resolvedParams.unitId])

  const loadData = async () => {
    try {
      const unitId = parseInt(resolvedParams.unitId, 10)
      console.log('Loading data for unit:', unitId)
      
      const unitResponse = await fetch(`http://localhost:3100/teachingUnits/${unitId}`)
      if (!unitResponse.ok) {
        throw new Error(`Failed to fetch unit: ${unitResponse.status}`)
      }
      const unitData = await unitResponse.json()
      setUnit(unitData)

      const plansResponse = await fetch(`http://localhost:3100/teachingPlans?unitId=${unitId}`)
      if (!plansResponse.ok) {
        throw new Error(`Failed to fetch plans: ${plansResponse.status}`)
      }
      const plansData = await plansResponse.json()
      setPlans(plansData)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "获取单元教案数据失败",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push('/dashboard/unit-teaching')
  }

  const handleAddPlan = () => {
    toast({
      title: "添加教案",
      description: "添加关联教案功能开发中",
    })
  }

  if (!unit) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{unit.name}</h1>
            <p className="text-muted-foreground">{unit.subject} | {unit.grade}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileIcon className="h-4 w-4 mr-2" />
            导出教案
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            保存修改
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">学科</h3>
              <p className="text-sm">{unit.subject}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">年级</h3>
              <p className="text-sm">{unit.grade}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">创建时间</h3>
              <p className="text-sm">{new Date(unit.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">状态</h3>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                进行中
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">单元描述</h3>
            <p className="text-sm">{unit.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>教学目标</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">课程标准</h3>
              <ul className="list-disc list-inside space-y-1">
                {unit.analysis.standards.map((standard, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{standard}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">教学目标</h3>
              <ul className="list-disc list-inside space-y-1">
                {unit.analysis.teachingGoals.map((goal, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{goal}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>教学准备</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">前置知识</h3>
              <ul className="list-disc list-inside space-y-1">
                {unit.analysis.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{prerequisite}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">教学资源</h3>
              <ul className="list-disc list-inside space-y-1">
                {unit.analysis.materials.map((material, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{material}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>核心素养</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(unit.analysis.competencies).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox checked={value} disabled />
                <label className="text-sm">
                  {key === 'knowledge' && '数感'}
                  {key === 'skills' && '运算能力'}
                  {key === 'emotions' && '情感态度'}
                  {key === 'spaceAwareness' && '空间观念'}
                  {key === 'logicalThinking' && '推理意识'}
                  {key === 'practicalAbility' && '实践能力'}
                  {key === 'innovation' && '创新意识'}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>课程内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">内容概述</h3>
            <p className="text-sm">{unit.analysis.content.overview}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">学习目标</h3>
            <p className="text-sm">{unit.analysis.content.learningObjectives}</p>
          </div>
        </CardContent>
      </Card>

      {unit && <KnowledgeStructure unitId={unit.id} />}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>关联教案</CardTitle>
            <Button onClick={handleAddPlan}>
              <Plus className="h-4 w-4 mr-2" />
              添加教案
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {plans.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      上传时间：{new Date(plan.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/unit-teaching/unit/${unit.id}/plan/${plan.id}`)}
                  >
                    预览
                  </Button>
                  <Button variant="outline" size="sm">下载</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 