'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { KnowledgePoint, KnowledgeRelation } from "@/lib/api/knowledge-structure"
import {
  fetchUnitKnowledgeStructure,
  createKnowledgePoint,
  updateKnowledgePoint,
  deleteKnowledgePoint,
  createKnowledgeRelation,
  updateKnowledgeRelation,
  deleteKnowledgeRelation
} from "@/lib/api/knowledge-structure"

interface KnowledgeStructureProps {
  unitId: string | number
}

export function KnowledgeStructure({ unitId }: KnowledgeStructureProps) {
  const [points, setPoints] = useState<KnowledgePoint[]>([])
  const [relations, setRelations] = useState<KnowledgeRelation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPoint, setEditingPoint] = useState<KnowledgePoint | null>(null)
  const [editingRelation, setEditingRelation] = useState<KnowledgeRelation | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadKnowledgeStructure() {
      try {
        setLoading(true)
        setError(null)
        
        // 确保 unitId 是数字类型
        const numericUnitId = typeof unitId === 'string' ? parseInt(String(unitId), 10) : unitId
        
        if (isNaN(numericUnitId)) {
          throw new Error('无效的单元ID')
        }

        console.log('Loading knowledge structure for unit:', numericUnitId)
        
        const { points, relations } = await fetchUnitKnowledgeStructure(numericUnitId)
        
        // 检查返回的数据是否为空数组而不是 null
        if (!Array.isArray(points) || !Array.isArray(relations)) {
          console.error('Invalid data structure:', { points, relations })
          throw new Error('返回的数据格式不正确')
        }

        setPoints(points)
        setRelations(relations)
      } catch (error) {
        console.error('Error loading knowledge structure:', error)
        const errorMessage = error instanceof Error 
          ? error.message 
          : '加载知识结构失败'
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "错误",
          description: errorMessage
        })
      } finally {
        setLoading(false)
      }
    }

    if (unitId) {
      loadKnowledgeStructure()
    }
  }, [unitId, toast])

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>知识结构</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const handleAddPoint = async (data: Omit<KnowledgePoint, 'id'>) => {
    try {
      const newPoint = await createKnowledgePoint(data)
      setPoints([...points, newPoint])
      toast({
        title: "成功",
        description: "添加知识点成功"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "添加知识点失败"
      })
    }
  }

  const handleUpdatePoint = async (id: string, data: Partial<KnowledgePoint>) => {
    try {
      const updatedPoint = await updateKnowledgePoint(id, data)
      setPoints(points.map(p => p.id === id ? updatedPoint : p))
      toast({
        title: "成功",
        description: "更新知识点成功"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "更新知识点失败"
      })
    }
  }

  const handleDeletePoint = async (id: string) => {
    try {
      await deleteKnowledgePoint(id)
      setPoints(points.filter(p => p.id !== id))
      // 同时删除相关的关系
      setRelations(relations.filter(r => r.sourceId !== id && r.targetId !== id))
      toast({
        title: "成功",
        description: "删除知识点成功"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "删除知识点失败"
      })
    }
  }

  const handleAddRelation = async (data: Omit<KnowledgeRelation, 'id'>) => {
    try {
      const newRelation = await createKnowledgeRelation(data)
      setRelations([...relations, newRelation])
      toast({
        title: "成功",
        description: "添加关系成功"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "添加关系失败"
      })
    }
  }

  // ... 其他处理函数

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>知识结构</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setEditingPoint({} as KnowledgePoint)}>
              <Plus className="h-4 w-4 mr-2" />
              添加知识点
            </Button>
            <Button onClick={() => setEditingRelation({} as KnowledgeRelation)}>
              <LinkIcon className="h-4 w-4 mr-2" />
              添加关系
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>加载中...</div>
        ) : (
          <div className="space-y-6">
            {/* 知识点列表 */}
            <div className="space-y-4">
              <h3 className="font-medium">知识点</h3>
              {points.map(point => (
                <div key={point.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{point.title}</div>
                    <div className="text-sm text-muted-foreground">{point.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingPoint(point)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePoint(point.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 知识点关系列表 */}
            <div className="space-y-4">
              <h3 className="font-medium">知识点关系</h3>
              {relations.map(relation => (
                <div key={relation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div>{points.find(p => p.id === relation.sourceId)?.title}</div>
                    <LinkIcon className="h-4 w-4" />
                    <div>{points.find(p => p.id === relation.targetId)?.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingRelation(relation)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRelation(relation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 