'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { uploadClassroomMoment } from "@/lib/api/classroom-moments"
import { SUBJECTS } from "@/lib/constants/subjects"

// 允许的文件类型
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/mp4'
]

// 最大文件大小 (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024

interface FormData {
  title: string
  subject: string
  grade: string
  class: string
  description: string
}

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const { toast } = useToast()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subject: '',
    grade: '',
    class: '',
    description: ''
  })

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "文件类型不支持",
        description: "请上传 PDF、Word 或 MP4 文件"
      })
      return
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "文件太大",
        description: "文件大小不能超过 100MB"
      })
      return
    }

    setMediaFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mediaFile) {
      toast({
        variant: "destructive",
        title: "请选择文件",
        description: "需要上传课堂实录文件"
      })
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      const formDataToSend = new FormData()
      formDataToSend.append('file', mediaFile)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('grade', formData.grade)
      formDataToSend.append('class', formData.class)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('tags', JSON.stringify(tags))
      formDataToSend.append('date', new Date().toISOString().split('T')[0])

      await uploadClassroomMoment(formDataToSend, (progress) => {
        setUploadProgress(progress)
      })

      toast({
        title: "上传成功",
        description: "课堂实录已成功上传"
      })

      onOpenChange(false)
      // 重置表单
      setFormData({
        title: '',
        subject: '',
        grade: '',
        class: '',
        description: ''
      })
      setTags([])
      setMediaFile(null)
      setUploadProgress(0)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: "请稍后重试"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>上传课堂实录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">课堂标题</Label>
              <Input id="title" placeholder="输入课堂标题" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">学科</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择学科" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBJECTS).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">年级</Label>
              <Input id="grade" placeholder="输入年级" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">班级</Label>
              <Input id="class" placeholder="输入班级" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">课堂描述</Label>
            <Textarea 
              id="description" 
              placeholder="描述本节课的主要内容和亮点..." 
              className="h-20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="输入标签并按回车添加"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>

          <div className="space-y-2">
            <Label>课堂实录</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.mp4"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
                disabled={isUploading}
              />
              <label 
                htmlFor="media-upload"
                className={`cursor-pointer flex flex-col items-center gap-2 ${
                  isUploading ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {mediaFile 
                    ? `已选择: ${mediaFile.name}`
                    : '点击上传文件 (PDF、Word、MP4)'
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  最大文件大小: 100MB
                </div>
              </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>上传进度</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? '上传中...' : '上传'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 