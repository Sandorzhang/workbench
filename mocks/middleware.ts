import type { Request, Response, NextFunction } from 'express'

interface QueryParams {
  q?: string
  classId?: string
  date?: string
  unitId?: string
  [key: string]: string | undefined
}

export default function middleware(req: Request, res: Response, next: NextFunction) {
  // 移除 /api 前缀
  req.url = req.url.replace(/^\/api/, '')

  // 处理查询参数
  const query = req.query as QueryParams

  // 处理课堂时光机相关请求
  if (req.path.match(/\/classroom-timeline\/class\/\d+\/daily/)) {
    const classId = req.path.split('/')[3]
    const date = query.date || new Date().toISOString().split('T')[0]
    req.url = `/timelines?classId=${classId}&date=${date}&_embed=moments`
  }

  // 处理写作记录查询
  if (req.path.match(/\/chinese-writing\/units\/\d+\/records/)) {
    const unitId = req.path.split('/')[3]
    req.url = `/records?unitId=${unitId}&_expand=unit`
  }

  // 记录请求日志
  console.log(`${req.method} ${req.url}`, req.body || '')

  next()
} 