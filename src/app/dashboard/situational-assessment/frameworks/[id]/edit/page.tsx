'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/dashboard/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Scale, Plus, Trash2, Save } from "lucide-react"
import { cn } from "@/lib/types/utils"
import { fetchFrameworkById, updateFramework } from "@/lib/api/assessment"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"

interface DimensionForm {
  name: string
  weight: number
  indicators: {
    name: string
    description: string
    score: number
  }[]
}

export default function EditFrameworkPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dimensions, setDimensions] = useState<DimensionForm[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFramework()
  }, [params.id])

  const loadFramework = async () => {
    try {
      const data = await fetchFrameworkById(Number(params.id))
      setName(data.name)
      setDescription(data.description)
      setDimensions(data.dimensions.map(dim => ({
        name: dim.name,
        weight: dim.weight,
        indicators: dim.indicators.map(ind => ({
          name: ind.name,
          description: ind.description,
          score: ind.score
        }))
      })))
    } catch (error) {
      console.error('加载框架失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addDimension = () => {
    setDimensions([
      ...dimensions,
      {
        name: '',
        weight: 0,
        indicators: [{ name: '', description: '', score: 0 }]
      }
    ])
  }

  const removeDimension = (index: number) => {
    setDimensions(dimensions.filter((_, i) => i !== index))
  }

  const addIndicator = (dimensionIndex: number) => {
    const newDimensions = [...dimensions]
    newDimensions[dimensionIndex].indicators.push({
      name: '',
      description: '',
      score: 0
    })
    setDimensions(newDimensions)
  }

  const removeIndicator = (dimensionIndex: number, indicatorIndex: number) => {
    const newDimensions = [...dimensions]
    newDimensions[dimensionIndex].indicators = 
      newDimensions[dimensionIndex].indicators.filter((_, i) => i !== indicatorIndex)
    setDimensions(newDimensions)
  }

  const updateDimension = (index: number, field: keyof DimensionForm, value: string | number) => {
    const newDimensions = [...dimensions]
    newDimensions[index][field] = value
    setDimensions(newDimensions)
  }

  const updateIndicator = (
    dimensionIndex: number,
    indicatorIndex: number,
    field: keyof DimensionForm['indicators'][0],
    value: string | number
  ) => {
    const newDimensions = [...dimensions]
    newDimensions[dimensionIndex].indicators[indicatorIndex][field] = value
    setDimensions(newDimensions)
  }

  const handleSubmit = async () => {
    try {
      await updateFramework(Number(params.id), {
        name,
        description,
        dimensions: dimensions.map((dim, i) => ({
          id: i + 1,
          name: dim.name,
          weight: Number(dim.weight),
          indicators: dim.indicators.map((ind, j) => ({
            id: j + 1,
            name: ind.name,
            description: ind.description,
            score: Number(ind.score)
          }))
        }))
      })
      router.push(`/dashboard/situational-assessment/frameworks/${params.id}`)
    } catch (error) {
      console.error('更新框架失败:', error)
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

  return (
    <PageContainer>
      <div className="px-6">
        <PageHeader
          title="编辑测评框架"
          description="修改测评框架的内容"
          icon={Scale}
          className="mb-6"
          showBack
          backUrl={`/dashboard/situational-assessment/frameworks/${params.id}`}
        />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>框架名称</Label>
                <Input
                  placeholder="输入框架名称"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>框架描述</Label>
                <Textarea
                  placeholder="输入框架描述"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {dimensions.map((dimension, dimIndex) => (
            <Card key={dimIndex}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>评估维度 {dimIndex + 1}</span>
                  {dimensions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDimension(dimIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>维度名称</Label>
                    <Input
                      placeholder="输入维度名称"
                      value={dimension.name}
                      onChange={e => updateDimension(dimIndex, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>权重(%)</Label>
                    <Input
                      type="number"
                      placeholder="输入权重"
                      value={dimension.weight}
                      onChange={e => updateDimension(dimIndex, 'weight', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">评估指标</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIndicator(dimIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加指标
                    </Button>
                  </div>

                  {dimension.indicators.map((indicator, indIndex) => (
                    <Card key={indIndex}>
                      <CardContent className="pt-6">
                        <div className="grid gap-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <Label>指标名称</Label>
                              <Input
                                placeholder="输入指标名称"
                                value={indicator.name}
                                onChange={e => updateIndicator(dimIndex, indIndex, 'name', e.target.value)}
                              />
                            </div>
                            {dimension.indicators.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="mt-6"
                                onClick={() => removeIndicator(dimIndex, indIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>指标描述</Label>
                            <Textarea
                              placeholder="输入指标描述"
                              value={indicator.description}
                              onChange={e => updateIndicator(dimIndex, indIndex, 'description', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>分值</Label>
                            <Input
                              type="number"
                              placeholder="输入分值"
                              value={indicator.score}
                              onChange={e => updateIndicator(dimIndex, indIndex, 'score', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={addDimension}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加维度
            </Button>
            <Button
              onClick={handleSubmit}
              className={cn(
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary",
                "transition-all duration-300",
                "shadow-lg shadow-primary/20"
              )}
            >
              <Save className="h-4 w-4 mr-2" />
              保存修改
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 