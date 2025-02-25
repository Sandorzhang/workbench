'use client'

import { useEffect, useState } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchClassroomMoments } from "@/lib/api/classroom-moments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Search, Plus, XCircle, Camera, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { UploadDialog } from "@/components/classroom-moments/upload-dialog"
import { SUBJECTS } from "@/lib/constants/subjects"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"

interface ClassroomMoment {
  id: string
  title: string
  teacher: string
  subject: string
  grade: string
  class: string
  date: string
  description: string
  tags: string[]
  imageUrl: string
  likes: number
  comments: number
  analysisStatus?: 'pending' | 'completed' | 'failed'
}

const DEFAULT_IMAGE = "https://picsum.photos/400/300"

export default function ClassroomMomentsPage() {
  const [moments, setMoments] = useState<ClassroomMoment[]>([])
  const [filteredMoments, setFilteredMoments] = useState<ClassroomMoment[]>([])
  const [subjects, setSubjects] = useState<string[]>(Object.values(SUBJECTS))
  const [selectedSubject, setSelectedSubject] = useState<string>('全部')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchClassroomMoments()
        setMoments(data)
        setFilteredMoments(data)
      } catch (error) {
        console.error('Failed to fetch moments:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载课堂实录失败"
        })
      }
    }
    loadData()
  }, [])

  // 处理搜索和筛选
  useEffect(() => {
    // 首先过滤掉不完整的记录
    let result = moments.filter(moment => 
      moment.title && 
      moment.subject && 
      moment.teacher && 
      moment.grade && 
      moment.class &&
      moment.imageUrl &&
      (moment.analysisStatus === undefined || moment.analysisStatus === 'completed')
    )

    // 应用学科筛选
    if (selectedSubject !== '全部') {
      result = result.filter(moment => moment.subject === selectedSubject)
    }

    // 应用搜索
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      result = result.filter(moment =>
        moment.title.toLowerCase().includes(searchLower) ||
        moment.description.toLowerCase().includes(searchLower) ||
        moment.teacher.toLowerCase().includes(searchLower) ||
        moment.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    setFilteredMoments(result)
  }, [moments, selectedSubject, debouncedSearchTerm])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="课堂时光机"
        description="记录和分享精彩课堂瞬间"
        icon={Camera}
        className="bg-white/50"
        action={
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              size="sm"
              className={cn(
                "bg-white/50 hover:bg-white/80",
                "transition-all duration-300"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className={cn(
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary",
                "transition-all duration-300",
                "shadow-lg shadow-primary/20"
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              上传课堂实录
            </Button>
          </div>
        }
      />

      {/* 搜索和筛选区 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div key="search" className="flex items-center gap-2 flex-1 max-w-sm">
          <Input 
            placeholder="搜索课堂记录..." 
            className="h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button size="sm" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div key="filters" className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-2 px-2">
          <Button 
            size="sm" 
            variant={selectedSubject === '全部' ? 'default' : 'ghost'}
            className={`min-w-[4rem] ${
              selectedSubject === '全部' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-muted'
            }`}
            onClick={() => setSelectedSubject('全部')}
            key="all"
          >
            全部
          </Button>
          {subjects.map((subject) => (
            <Button 
              key={subject} 
              size="sm" 
              variant="ghost"
              className={`min-w-[4rem] ${
                selectedSubject === subject 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>

      {/* 课堂记录列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMoments.map((moment) => (
          <Link 
            key={moment.id} 
            href={`/dashboard/classroom-moments/${moment.id}`}
            className={`group ${moment.analysisStatus === 'pending' || moment.analysisStatus === 'failed' ? 'pointer-events-none' : ''}`}
          >
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-40 w-full">
                {moment.analysisStatus === 'pending' && (
                  <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    <span className="text-sm">AI分析中...</span>
                  </div>
                )}
                {moment.analysisStatus === 'failed' && (
                  <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-white">
                    <XCircle className="h-8 w-8 text-red-500 mb-2" />
                    <span className="text-sm">分析失败</span>
                  </div>
                )}
                <Image
                  src={moment.imageUrl || DEFAULT_IMAGE}
                  alt={moment.title || '课堂记录'}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/50 hover:bg-black/70 transition-colors">
                    {moment.subject}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <h2 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-primary-foreground transition-colors">
                    {moment.title}
                  </h2>
                  <div key="info" className="text-sm text-white/90">
                    {moment.teacher} · {moment.grade}{moment.class}
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div key="stats" className="flex items-center gap-4">
                    <div key="likes" className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{moment.likes}</span>
                    </div>
                    <div key="comments" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{moment.comments}</span>
                    </div>
                  </div>
                  <span key="date">{moment.date}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        {filteredMoments.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            没有找到匹配的课堂记录
          </div>
        )}
      </div>

      <UploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  )
} 