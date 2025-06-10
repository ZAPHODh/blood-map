import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Nav } from "@/components/nav"
import { DataProvider } from "@/hooks/data"

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
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <DataProvider initialReadings={[]}>
          <div className="min-h-screen bg-gray-50">
            <Nav />
            <main className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  )
}
