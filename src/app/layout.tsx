import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Nav } from "@/components/nav"
import { DataProvider } from "@/hooks/data"
import { Toaster } from "@/components/ui/sonner"
import { getReadings } from "@/requests/get-readings"
import SessionProvider from "@/components/session-provider"
import { verifySession } from "@/lib/auth/dal"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Monitor de Pressão Arterial",
  description: "Acompanhe suas medições de pressão arterial e batimentos cardíacos",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await verifySession()
  const readings = await getReadings()
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider initialSession={session}>
          <DataProvider initialReadings={readings}>
            <div className="min-h-screen bg-gray-50">
              <Nav />
              <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
            </div>
          </DataProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
