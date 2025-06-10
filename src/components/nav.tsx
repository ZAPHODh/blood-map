"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    {
        name: "Dashboard",
        href: "/",
        icon: Home,
        description: "Visão geral e estatísticas",
    },
    {
        name: "Lançamentos",
        href: "/entry",
        icon: FileText,
        description: "Histórico completo de medições",
    },
]

export function Nav() {
    const pathname = usePathname()

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
                <div className="flex justify-between h-16" >
                    <div className="flex" >
                        < div className="flex-shrink-0 flex items-center" >
                            <Activity className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900" > Pressão Arterial </span>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8" >
                            {
                                navigation.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={
                                                cn(
                                                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200",
                                                    isActive
                                                        ? "border-blue-500 text-gray-900"
                                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                )
                                            }
                                        >
                                            <item.icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="sm:hidden" >
                    <div className="pt-2 pb-3 space-y-1" >
                        {
                            navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={
                                            cn(
                                                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200",
                                                isActive
                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                                            )
                                        }
                                    >
                                        <div className="flex items-center" >
                                            <item.icon className="w-4 h-4 mr-3" />
                                            <div>
                                                <div>{item.name} </div>
                                                < div className="text-xs text-gray-400" > {item.description} </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
