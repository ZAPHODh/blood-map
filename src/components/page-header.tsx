import type React from "react"
interface PageHeaderProps {
    title: string
    description: string
    children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>
            {children && <div className="flex gap-2">{children}</div>}
        </div>
    )
}
