'use client'

import { useState, useEffect } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { Building2 } from "lucide-react"
import { fetchCurrentTenant } from "@/lib/api/tenant"
import type { Tenant } from "@/lib/api/tenant"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadTenant() {
      try {
        const userStr = localStorage.getItem('user')
        console.log('User data from localStorage:', userStr)
        
        if (!userStr) {
          console.log('No user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        const user = JSON.parse(userStr)
        console.log('Parsed user data:', user)
        
        if (!user.tenantId) {
          console.log('No tenant ID found for user')
          toast({
            variant: "destructive",
            title: "错误",
            description: "用户没有关联的租户信息"
          })
          return
        }

        console.log('Attempting to fetch tenant data for ID:', user.tenantId)
        const data = await fetchCurrentTenant()
        console.log('Tenant data successfully received:', data)
        setTenant(data)
      } catch (error) {
        console.error('Error in loadTenant:', error)
        toast({
          variant: "destructive",
          title: "错误",
          description: "加载租户信息失败"
        })
      }
    }

    loadTenant()
  }, [toast, router])

  console.log('Current tenant state:', tenant) // 添加状态日志

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {tenant && (
            <>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{tenant.shortName}</span>
                  <span className="text-xs text-muted-foreground">{tenant.name}</span>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
            </>
          )}
          <UserNav />
        </div>
      </div>
    </div>
  )
} 