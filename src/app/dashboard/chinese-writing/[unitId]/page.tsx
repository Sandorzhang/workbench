'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Users, CheckCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { WritingUnit, WritingRecord } from "@/lib/api/chinese-writing"

interface PageProps {
  params: Promise<{ unitId: string }>
}

export default function UnitDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [unit, setUnit] = useState<WritingUnit | null>(null)
  const [records, setRecords] = useState<WritingRecord[]>([])

  useEffect(() => {
    loadData()
  }, [resolvedParams.unitId])

  const loadData = async () => {
    try {
      // ... 加载数据的代码保持不变
    } catch (error) {
      // ... 错误处理保持不变
    }
  }

  if (!unit) return null

  const submittedCount = records.length
  const gradedCount = records.filter(r => r.gradedAt).length
  const progress = (gradedCount / submittedCount) * 100 || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{unit.title}</h1>
            <p className="text-muted-foreground">{unit.grade} | 第{unit.term}学期</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              提交情况
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submittedCount}</div>
            <p className="text-sm text-muted-foreground">已提交习作数量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              批改进度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gradedCount}</div>
            <p className="text-sm text-muted-foreground">已批改习作数量</p>
            <Progress value={progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              班级情况
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">参与班级数量</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>习作列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/chinese-writing/${unit.id}/${record.id}`)}
              >
                <div>
                  <h3 className="font-medium">{record.studentName}</h3>
                  <p className="text-sm text-muted-foreground">
                    提交时间：{new Date(record.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {record.gradedAt ? (
                    <div className="text-right">
                      <div className="font-medium">{record.score}分</div>
                      <p className="text-sm text-muted-foreground">已批改</p>
                    </div>
                  ) : (
                    <Badge variant="outline">待批改</Badge>
                  )}
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 