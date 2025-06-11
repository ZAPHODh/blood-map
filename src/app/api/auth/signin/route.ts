
import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { encode } from "@/lib/auth/server-session";
import { Session } from "@/lib/auth/types";
import prisma from "@/lib/prisma";
import { signinSchema } from "@/lib/zod/signin-schema";
import bcrypt from "bcryptjs";


import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = signinSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({
            error: "Dados inválidos",
            details: parsed.error.flatten()
        }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const sanitizedEmail: string = email.toLowerCase();
    const foundUser = await prisma.user.findFirst({
        where: { email: sanitizedEmail }
    });

    if (!foundUser || !foundUser.accessToken) {
        NextResponse.json({ message: 'Email inválido' }, { status: 401 });
        return;
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
        NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        return;
    }

    const newSession: Session = {
        email: sanitizedEmail,
        accessToken: foundUser.accessToken,
        user: {
            id: foundUser.id,
            name: foundUser.name,
            image: foundUser.image
        },
    };

    const session = await encode(newSession);
    (await cookies()).set(SESSION_COOKIE_NAME, session, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + SESSION_COOKIE_MAX_AGE),
        sameSite: "lax",
        path: "/",
    });

    return NextResponse.json(newSession, { status: 200 });


}