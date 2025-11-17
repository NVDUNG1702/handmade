"use client"

import { PropsWithChildren, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function RequireAuth({ children }: PropsWithChildren) {
  const { mounted, authed } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!mounted) return
    if (!authed) {
      const callback = encodeURIComponent(pathname || "/")
      router.replace(`/login?callback=${callback}`)
    }
  }, [mounted, authed, pathname, router])

  if (!mounted) return null
  if (!authed) return null
  return <>{children}</>
}



