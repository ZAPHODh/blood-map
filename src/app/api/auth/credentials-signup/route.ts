
import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { encode } from "@/lib/auth/server-session";
import { signupSchema } from "@/lib/zod/signup-schema";
import bcrypt from 'bcryptjs';

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Session } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({
            error: "Dados inválidos",
            details: parsed.error.flatten()
        }, { status: 400 });
    }
    const { email, name, password } = parsed.data
    const sanitizedEmail = email.toLowerCase();
    const sanitizedName = name.toLowerCase()
    const hashedPassword = await bcrypt.hash(password, 12);
    const accessToken = crypto
        .createHash('sha256')
        .update(uuidv4())
        .digest('hex');
    const createdUser = await prisma.user.create({
        data: {
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            accessToken
        }
    });
    if (!createdUser || !createdUser.name || !createdUser.email) {
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
    const newSession: Session = {
        accessToken: accessToken,
        email: sanitizedEmail,
        user: {
            id: createdUser.id,
            name: createdUser.name,
            image: createdUser.image
        },
    }
    if (createdUser && newSession) {
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

    return NextResponse.json(newSession, { status: 400 });
}