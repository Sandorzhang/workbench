'use client'

import { useEffect } from 'react'

export function EventProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('User interaction detected')
    }

    document.addEventListener('click', handleUserInteraction, { passive: true })
    return () => {
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [])

  return <>{children}</>
} 