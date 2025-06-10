import { verifySession } from "@/lib/auth/dal";
import { encode, updateSession } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";
import { Session } from "@/lib/auth/types";

export async function POST() {
    const { session } = await verifySession()

    if (!session) {
        return new Response(null, { status: 401 })
    }

    const user = await prisma.user.findFirst({
        where: {
            accessToken: session.accessToken
        }
    });

    if (!user) {
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        return;
    }

    const newAccessToken = crypto
        .createHash('sha256')
        .update(uuidv4())
        .digest('hex');

    await prisma.user.update({
        where: { id: user.id },
        data: { accessToken: newAccessToken }
    });
    const payload: Session = {
        accessToken: newAccessToken,
        email: user.email,
        user: {
            id: user.id,
            name: user.name,

            image: user.image
        },

    }
    const newSession = await encode(payload)
    await updateSession(newSession)
    return NextResponse.json(session.user, { status: 200 });
}