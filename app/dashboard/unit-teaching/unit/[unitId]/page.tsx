'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileIcon, ArrowLeft, Plus } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

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

export default function UnitDetailPage({ params }: { params: Promise<{ unitId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [unit, setUnit] = useState<TeachingUnit | null>(null)
  const [plans, setPlans] = useState<TeachingPlan[]>([])

  useEffect(() => {
    loadData()
  }, [resolvedParams.unitId])

  const loadData = async () => {
    try {
      const unitResponse = await fetch(`http://localhost:3100/teachingUnits/${resolvedParams.unitId}`)
      const unitData = await unitResponse.json()
      setUnit(unitData)

      const plansResponse = await fetch(`http://localhost:3100/teachingPlans?unitId=${resolvedParams.unitId}`)
      const plansData = await plansResponse.json()
      setPlans(plansData)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: "获取单元教案数据失败",
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{unit.name}</h1>
          <p className="text-muted-foreground">{unit.subject} | {unit.grade}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>单元规划性质</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">单元划分依据</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="standards" checked={unit.analysis.standards.includes('课程标准')} disabled />
                <label htmlFor="standards">课程标准</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="teaching" checked={unit.analysis.standards.includes('教材教学')} disabled />
                <label htmlFor="teaching">教材教学</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cognitive" checked={unit.analysis.standards.includes('知识结构')} disabled />
                <label htmlFor="cognitive">知识结构</label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">课程内容领域</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="numbers" checked disabled />
                <label htmlFor="numbers">数与运算</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="graphics" checked={false} disabled />
                <label htmlFor="graphics">图形与几何</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="statistics" checked={false} disabled />
                <label htmlFor="statistics">统计与概率</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="synthesis" checked disabled />
                <label htmlFor="synthesis">综合与实践</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>核心素养</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="knowledge" checked={unit.analysis.competencies.knowledge} disabled />
            <label htmlFor="knowledge">数感</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="skills" checked={unit.analysis.competencies.skills} disabled />
            <label htmlFor="skills">运算能力</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="logical" checked={unit.analysis.competencies.logicalThinking} disabled />
            <label htmlFor="logical">推理意识</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="space" checked={unit.analysis.competencies.spaceAwareness} disabled />
            <label htmlFor="space">空间观念</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="innovation" checked={unit.analysis.competencies.innovation} disabled />
            <label htmlFor="innovation">创新意识</label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>课程内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">内容要求</h3>
            <p className="text-sm text-muted-foreground">{unit.analysis.content.overview}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">学业要求</h3>
            <p className="text-sm text-muted-foreground">{unit.analysis.content.learningObjectives}</p>
          </div>
        </CardContent>
      </Card>

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
        <CardContent className="space-y-4">
          {plans.map(plan => (
            <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    上传时间：{new Date(plan.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button variant="outline">预览</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 