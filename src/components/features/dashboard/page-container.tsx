'use client'

import { cn } from "@/lib/types/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className="container mx-auto py-8 space-y-8 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/30 backdrop-blur-3xl -z-10" />
      
      <div className={cn("relative", className)}>
        {children}
      </div>
    </div>
  )
} 