'use client'

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitCard } from "@/components/chinese-writing/unit-card"
import { fetchWritingUnits } from "@/lib/api/chinese-writing"
import type { WritingUnit } from "@/lib/api/chinese-writing"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"

const GRADES = ['三年级', '四年级', '五年级', '六年级']
const TERMS = ['第一学期', '第二学期']

export default function ChineseWritingPage() {
  const [selectedGrade, setSelectedGrade] = useState('三年级')
  const [selectedTerm, setSelectedTerm] = useState(1)
  const [units, setUnits] = useState<WritingUnit[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadUnits()
  }, [selectedGrade, selectedTerm, toast])

  const loadUnits = async () => {
    try {
      setLoading(true)
      const data = await fetchWritingUnits(selectedGrade, selectedTerm)
      setUnits(data)
    } catch (error) {
      console.error('Error loading units:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "加载习作单元失败，请稍后重试"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">语文单元习作</h1>
          <p className="text-muted-foreground">管理和批改学生的单元习作</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/chinese-writing/records')}
            className="gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            评价记录
          </Button>
          <div className="p-2 bg-primary/10 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">年级</h3>
            <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                {GRADES.map(grade => (
                  <TabsTrigger key={grade} value={grade}>{grade}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium mb-2">学期</h3>
            <Tabs value={String(selectedTerm)} onValueChange={value => setSelectedTerm(Number(value))}>
              <TabsList className="grid grid-cols-2 w-full">
                {TERMS.map((term, index) => (
                  <TabsTrigger key={term} value={String(index + 1)}>{term}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse">
              <div className="w-full h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              id={unit.id}
              title={unit.title}
              coverImage={unit.coverImage}
              description={unit.description}
              status={unit.status}
            />
          ))}
        </div>
      )}
    </div>
  )
} 