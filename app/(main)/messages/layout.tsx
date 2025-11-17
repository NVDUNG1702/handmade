import type React from "react"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      {/* Messages page without footer for fixed height */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
