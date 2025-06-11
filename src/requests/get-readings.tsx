import { Reading } from "@/generated/prisma"

export async function getReadings() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/readings`)
    if (!res.ok) {
        return []
    }
    const readings: Reading[] = await res.json()
    console.log(readings)
    return readings
}