import "server-only";
import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";

import { NextResponse } from "next/server";
import { cookies } from "next/dist/server/request/cookies";

export async function POST() {
    (await cookies()).delete(SESSION_COOKIE_NAME);
    return NextResponse.json({ success: true }, { status: 200 });
}