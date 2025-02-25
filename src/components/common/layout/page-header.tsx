import { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
}

export function PageHeader({
  title,
  description,
  icon: Icon
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="rounded-xl bg-slate-100 p-2.5">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </div>
  )
} 