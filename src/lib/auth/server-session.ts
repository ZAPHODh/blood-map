
import "server-only";

import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "./helper";
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from "next/headers";
import { Session } from "./types";


function getSecretKey() {
    const secret = process.env.SESSION_JWT_SECRET;
    if (!secret) {
        throw new Error("SESSION_JWT_SECRET não está definido");
    }
    return new TextEncoder().encode(secret);
}

export async function getServerSession(): Promise<Session | undefined> {
    const cookie = (await cookies()).get(SESSION_COOKIE_NAME);

    if (!cookie) {
        return undefined;
    }

    const session = await decode(cookie.value);
    return session;
}

export async function encode(user: Session): Promise<string> {
    const secretKey = getSecretKey();

    const token = await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("map")
        .setAudience("map")
        .setExpirationTime("7d")
        .sign(secretKey);

    return token;
}

export async function decode(token?: string): Promise<Session | undefined> {
    if (!token) return undefined;

    try {
        const secretKey = getSecretKey();
        const { payload } = await jwtVerify(token, secretKey, {
            issuer: "map",
            audience: "map",
        });

        return payload as Session;
    } catch (err) {
        console.error("Falha na decodificação do token:", err);
        return undefined;
    }
}

export async function updateSession(session: string) {
    const expires = new Date(Date.now() + SESSION_COOKIE_MAX_AGE)
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}