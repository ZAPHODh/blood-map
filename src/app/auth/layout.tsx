import React from "react";
import { verifySession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";

export default async function Page(props: { children: React.ReactNode }) {
    const { session } = await verifySession()

    if (session) redirect('/')
    return (
        <div className="flex flex-col gap-4 p-6 md:p-10 w-full min-h-screen">
            <div className="flex justify-center gap-2 md:justify-start">
            </div>
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md">
                    {props.children}
                </div>
            </div>
        </div>
    )
}