import { verifySession } from "@/lib/auth/dal";
import prisma from "@/lib/prisma";
import { realReadingSchema } from "@/lib/zod/reading-schema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json(null, { status: 401 });
    }
    const user = await prisma.user.findFirst({
        where: { accessToken: token },
    })
    if (!user) {
        return NextResponse.json(null, { status: 401 });
    }
    const readings = await prisma.reading.findMany({
        where: { userId: user.id },
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
    console.log('body', body)
    const parsed = realReadingSchema.safeParse(body);
    if (!parsed.success) {
        console.log(parsed.error)
        return NextResponse.json({
            error: "Dados inválidos",
            details: parsed.error.flatten()
        }, { status: 400 });
    }
    const newReading = await prisma.reading.create({
        data: { ...parsed.data, userId: session.user.id },
    })
    return NextResponse.json(newReading, { status: 201 });
}