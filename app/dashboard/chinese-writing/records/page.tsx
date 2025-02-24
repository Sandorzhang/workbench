'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface WritingRecord {
  id: string
  studentName: string
  className: string
  title: string
  submittedAt: string
  gradedAt?: string
  score?: number
}

const MOCK_RECORDS: WritingRecord[] = [
  {
    id: "1",
    studentName: "张三",
    className: "三年级一班",
    title: "我的一天",
    submittedAt: "2024-03-20T10:00:00Z",
    gradedAt: "2024-03-20T14:00:00Z",
    score: 92
  },
  {
    id: "2",
    studentName: "李四",
    className: "三年级一班",
    title: "春游记",
    submittedAt: "2024-03-19T09:30:00Z",
    gradedAt: "2024-03-19T15:20:00Z",
    score: 88
  },
  {
    id: "3",
    studentName: "王五",
    className: "三年级二班",
    title: "我的理想",
    submittedAt: "2024-03-18T11:20:00Z"
  }
]

export default function WritingRecordsPage() {
  const router = useRouter()
  const [records] = useState<WritingRecord[]>(MOCK_RECORDS)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.includes(searchTerm) || 
                         record.title.includes(searchTerm)
    const matchesClass = selectedClass === "all" || record.className === selectedClass
    return matchesSearch && matchesClass
  })

  const classes = Array.from(new Set(records.map(r => r.className)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">评价记录</h1>
            <p className="text-muted-foreground">查看所有习作评价记录</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生姓名或习作标题"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择班级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部班级</SelectItem>
                {classes.map(className => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>评价列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{record.studentName}</h3>
                    <span className="text-sm text-muted-foreground">({record.className})</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    习作：{record.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    提交时间：{new Date(record.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {record.gradedAt ? (
                    <div className="text-right">
                      <div className="font-medium">{record.score}分</div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.gradedAt).toLocaleDateString()} 批改
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline">待批改</Badge>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/dashboard/chinese-writing/records/${record.id}`)}
                  >
                    查看详情
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