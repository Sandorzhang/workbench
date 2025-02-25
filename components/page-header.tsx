import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  icon: Icon, 
  action,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("relative mb-6", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-violet-50/80 rounded-2xl backdrop-blur-sm" />
      <div className="absolute inset-0 bg-grid-black/[0.02] rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 rounded-2xl" />
      <div className="relative p-6 md:p-8 flex items-center justify-between">
        <div className="flex items-center">
          {Icon && (
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center mr-5",
              "bg-gradient-to-br from-primary/10 to-primary/5",
              "ring-1 ring-primary/10 shadow-sm"
            )}>
              <Icon className="h-7 w-7 text-primary" />
            </div>
          )}
          <div>
            <h1 className={cn(
              "text-3xl font-bold tracking-tight",
              "bg-gradient-to-br from-slate-900 to-slate-700",
              "bg-clip-text text-transparent"
            )}>
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground/90 mt-1.5 text-[15px]">{description}</p>
            )}
          </div>
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">{action}</div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
    </div>
  )
} 