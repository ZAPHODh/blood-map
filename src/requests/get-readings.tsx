
import { Reading } from "@/generated/prisma"
import { verifySession } from "@/lib/auth/dal"

export async function getReadings() {
    const { session } = await verifySession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/readings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": `Bearer ${session?.accessToken}`
        }
    })
    if (!res.ok) {
        return []
    }
    const readings: Reading[] = await res.json()
    console.log(readings)
    return readings
}