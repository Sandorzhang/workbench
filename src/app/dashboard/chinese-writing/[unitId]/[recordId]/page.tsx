'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { WritingRecord } from "@/lib/api/chinese-writing"
import { fetchWritingRecord, updateWritingRecord } from "@/lib/api/chinese-writing"

interface PageProps {
  params: {
    unitId: string
    recordId: string
  }
}

export default function WritingRecordDetailPage({ params }: PageProps) {
  const [record, setRecord] = useState<WritingRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState<string>('')
  const [feedback, setFeedback] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadRecord() {
      try {
        setLoading(true)
        const data = await fetchWritingRecord(params.recordId)
        setRecord(data)
        if (data.score) setScore(String(data.score))
        if (data.feedback) setFeedback(data.feedback)
      } catch (error) {
        console.error('Error loading record:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载习作记录失败"
        })
      } finally {
        setLoading(false)
      }
    }

    loadRecord()
  }, [params.recordId, toast])

  const handleSubmit = async () => {
    try {
      await updateWritingRecord(params.recordId, {
        score: Number(score),
        feedback,
        gradedAt: new Date().toISOString()
      })

      toast({
        title: "成功",
        description: "评价已保存"
      })
      router.back()
    } catch (error) {
      console.error('Error saving evaluation:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "保存评价失败"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          未找到习作记录
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">习作评价</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {record.studentName}的习作
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>习作内容</CardTitle>
            <Badge variant={record.gradedAt ? "default" : "secondary"}>
              {record.gradedAt ? "已评价" : "待评价"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{record.content}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>评价信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">得分</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="请输入得分（0-100）"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">评语</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="请输入评语"
              className="mt-1"
              rows={6}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!score || !feedback}
          >
            提交评价
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 