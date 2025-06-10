import { verifySession } from "@/lib/auth/dal";
import prisma from "@/lib/prisma";
import { readingSchema } from "@/lib/zod/reading-schema";
import { NextResponse } from "next/server";

export async function GET() {
    const { session } = await verifySession()
    if (!session) {
        return NextResponse.json(null, { status: 401 });
    }
    const readings = await prisma.reading.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(readings);
}
export async function POST(request: Request) {
    const { session } = await verifySession()
    if (!session) {
        return NextResponse.json(null, { status: 401 });
    }
    const body = await request.json();
    const parsed = readingSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({
            error: "Dados inválidos",
            details: parsed.error.flatten()
        }, { status: 400 });
    }
    const newReading = await prisma.reading.create({
        data: { ...parsed.data, userId: session.user.id, diastolic: parseInt(parsed.data.diastolic), systolic: parseInt(parsed.data.systolic), heartRate: parseInt(parsed.data.heartRate) },
    })
    NextResponse.json(newReading, { status: 201 });
}