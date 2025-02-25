import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/types/utils"

interface UnitCardProps {
  id: string
  title: string
  coverImage: string
  description?: string
  status: 'not_started' | 'in_progress' | 'completed'
}

const statusConfig = {
  not_started: { label: '未开始', color: 'bg-muted text-muted-foreground' },
  in_progress: { label: '进行中', color: 'bg-primary text-primary-foreground' },
  completed: { label: '已完成', color: 'bg-green-500 text-white' },
}

export function UnitCard({ id, title, coverImage, description, status }: UnitCardProps) {
  return (
    <Link href={`/dashboard/chinese-writing/${id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />
          <div className="absolute top-2 right-2">
            <Badge className={cn("font-normal", statusConfig[status].color)}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 