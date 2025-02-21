'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileIcon, Plus } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

interface TeachingUnit {
  id: number
  name: string
  subject: string
  grade: string
  description: string
  createdAt: string
}

interface TeachingPlan {
  id: number
  unitId: number | null // null 表示独立教案
  name: string
  description: string
  fileUrl: string
  fileType: string
  uploadedAt: string
  createdBy: number
}

export default function UnitTeachingPage() {
  const [units, setUnits] = useState<TeachingUnit[]>([])
  const [plans, setPlans] = useState<TeachingPlan[]>([])
  const [activeTab, setActiveTab] = useState('unit')
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // 获取当前用户
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        router.push('/login')
        return
      }
      const user = JSON.parse(userStr)

      // 获取教学单元（只获取当前教师的单元）
      const unitsResponse = await fetch(`http://localhost:3100/teachingUnits?teacherId=${user.id}`)
      const unitsData = await unitsResponse.json()
      setUnits(unitsData)

      // 获取教案（只获取当前教师的教案）
      const plansResponse = await fetch(`http://localhost:3100/teachingPlans?createdBy=${user.id}`)
      const plansData = await plansResponse.json()
      setPlans(plansData)
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: "获取教学数据失败",
        variant: "destructive",
      })
    }
  }

  const handlePreview = (plan: TeachingPlan) => {
    toast({
      title: "预览功能",
      description: "文件预览功能开发中",
    })
  }

  const handleCreateUnit = () => {
    toast({
      title: "创建功能",
      description: "创建单元教案功能开发中",
    })
  }

  const handleCreatePlan = () => {
    toast({
      title: "创建功能",
      description: "创建独立教案功能开发中",
    })
  }

  const handleUnitClick = (unitId: number) => {
    router.push(`/dashboard/unit-teaching/unit/${unitId}`)
  }

  const handlePlanClick = (planId: number) => {
    router.push(`/dashboard/unit-teaching/plan/${planId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">单元教学管理</h1>
        <p className="text-muted-foreground">管理教学单元和教案</p>
      </div>

      <Tabs defaultValue="unit" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="unit">单元教案</TabsTrigger>
          <TabsTrigger value="single">独立教案</TabsTrigger>
        </TabsList>

        <TabsContent value="unit" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreateUnit}>
              <Plus className="h-4 w-4 mr-2" />
              创建单元教案
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.map(unit => (
              <Card 
                key={unit.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleUnitClick(unit.id)}
              >
                <CardHeader>
                  <CardTitle>{unit.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                    <div className="text-sm text-muted-foreground mt-2">
                      {unit.subject} | {unit.grade}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-sm">关联教案</div>
                    {plans
                      .filter(plan => plan.unitId === unit.id)
                      .map(plan => (
                        <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                上传时间：{new Date(plan.uploadedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handlePreview(plan)}>
                            预览
                          </Button>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="single" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreatePlan}>
              <Plus className="h-4 w-4 mr-2" />
              创建独立教案
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>独立教案列表</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans
                .filter(plan => plan.unitId === null)
                .map(plan => (
                  <div 
                    key={plan.id} 
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50"
                    onClick={() => handlePlanClick(plan.id)}
                  >
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
        </TabsContent>
      </Tabs>
    </div>
  )
} 