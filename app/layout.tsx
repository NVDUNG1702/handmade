import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { QueryProvider } from "@/components/query-provider-simple"
import { MessageSocketProvider } from "@/components/message-socket-provider"
import { Toaster } from "sonner"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Handmade - Nền tảng thủ công Việt Nam",
  description: "Kết nối nghệ nhân và khách hàng, chia sẻ đam mê thủ công",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <MessageSocketProvider>
                <Suspense fallback={null}>{children}</Suspense>
                <Toaster position="top-right" richColors />
                <Analytics />
              </MessageSocketProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
