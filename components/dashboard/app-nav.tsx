'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface AppNavProps {
  items: {
    title: string
    href: string
    icon: LucideIcon
  }[]
}

export function AppNav({ items }: AppNavProps) {
  const pathname = usePathname()

  return (
    <nav className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg border p-4 hover:bg-muted",
              isActive && "bg-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
} 