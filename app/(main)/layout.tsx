"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMessagesPage = pathname?.startsWith("/messages")

  return (
    <div className={isMessagesPage ? "flex flex-col h-screen" : "flex flex-col min-h-screen"}>
      <Navigation />
      <main className={isMessagesPage ? "flex-1 overflow-hidden h-screen-minus-nav" : "flex-1 pb-8"}>
        {children}
      </main>
      {!isMessagesPage && <Footer />}
    </div>
  )
}
