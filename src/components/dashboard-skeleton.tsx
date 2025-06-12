import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-md" />
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <Skeleton className="h-6 w-56 mb-2" />
                <Skeleton className="h-5 w-72" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-3 w-40 mt-1" />
                    </div>
                ))}
            </div>

            <div className="rounded-lg border p-6">
                <div className="mb-6">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="h-80">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
            <div className="rounded-lg border p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>

                <div className="rounded-md border">
                    <div className="border-b p-4 grid grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4" />
                        ))}
                    </div>
                    <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-5 gap-4">
                                {[...Array(5)].map((_, colIndex) => (
                                    <Skeleton key={colIndex} className="h-4" />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="text-center py-12">
                        <Skeleton className="h-5 w-48 mx-auto mb-2" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}