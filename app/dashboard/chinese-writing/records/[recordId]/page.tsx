'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, User, Calendar } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface WritingRecord {
  id: string
  studentName: string
  className: string
  title: string
  content: string
  submittedAt: string
  gradedAt?: string
  score?: number
  feedback?: string
}

interface PageProps {
  params: Promise<{ recordId: string }>
}

export default function WritingRecordDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [record, setRecord] = useState<WritingRecord | null>(null)
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState<number | "">("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [resolvedParams.recordId])

  const loadData = async () => {
    try {
      const response = await fetch(`http://localhost:3100/writingRecords/${resolvedParams.recordId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch record: ${response.status}`)
      }
      const data = await response.json()
      setRecord(data)
      setFeedback(data.feedback || "")
      setScore(data.score || "")
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "获取习作记录失败",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!record) return
    
    try {
      setSaving(true)
      const response = await fetch(`http://localhost:3100/writingRecords/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback,
          score: score === "" ? null : Number(score),
          gradedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      toast({
        title: "保存成功",
        description: "习作评价已更新"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "保存评价失败，请稍后重试"
      })
    } finally {
      setSaving(false)
    }
  }

  if (!record) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{record.title}</h1>
            <p className="text-muted-foreground">习作详情与评价</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          保存评价
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              学生信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">姓名</div>
                <div className="text-sm text-muted-foreground">{record.studentName}</div>
              </div>
              <div>
                <div className="text-sm font-medium">班级</div>
                <div className="text-sm text-muted-foreground">{record.className}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              提交信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">提交时间</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(record.submittedAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">状态</div>
                <Badge variant={record.gradedAt ? "default" : "outline"}>
                  {record.gradedAt ? "已批改" : "待批改"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              评分信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">分数</div>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  placeholder="输入分数"
                  min="0"
                  max="100"
                />
              </div>
              {record.gradedAt && (
                <div>
                  <div className="text-sm font-medium">批改时间</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.gradedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>习作内容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm">{record.content}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>评语</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="请输入评语..."
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>
    </div>
  )
} 