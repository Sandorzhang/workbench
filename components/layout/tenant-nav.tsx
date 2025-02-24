'use client'

import { Building2 } from "lucide-react"
import { fetchCurrentTenant } from "@/lib/api/tenant"
import type { Tenant } from "@/lib/api/tenant"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function TenantNav() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadTenant() {
      try {
        const data = await fetchCurrentTenant()
        setTenant(data)
      } catch (error) {
        console.error('Failed to load tenant:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载租户信息失败"
        })
      }
    }
    loadTenant()
  }, [toast])

  if (!tenant) return null

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="font-medium">{tenant.shortName}</span>
        <span className="text-xs text-muted-foreground">{tenant.name}</span>
      </div>
    </div>
  )
} 