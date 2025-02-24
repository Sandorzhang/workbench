'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link 
        href="/dashboard"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        工作台
      </Link>
    </nav>
  )
} 