"use client"

import { Button } from "@/components/ui/button"
import { Home, FileText } from "lucide-react"

type Page = "dashboard" | "records"

interface NavigationProps {
    currentPage: Page
    onPageChange: (page: Page) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
    return (
        <div className="flex gap-2 mb-6">
            <Button
                variant={currentPage === "dashboard" ? "default" : "outline"}
                onClick={() => onPageChange("dashboard")}
                className="flex items-center gap-2"
            >
                <Home className="w-4 h-4" />
                Dashboard
            </Button>
            <Button
                variant={currentPage === "records" ? "default" : "outline"}
                onClick={() => onPageChange("records")}
                className="flex items-center gap-2"
            >
                <FileText className="w-4 h-4" />
                Lançamentos
            </Button>
        </div>
    )
}
