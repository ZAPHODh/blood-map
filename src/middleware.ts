import { NextRequest, NextResponse } from 'next/server'

import { cookies } from 'next/headers'
import { decode } from './lib/auth/server-session'


const protectedRoutes = ['/dashboard', '/']
const publicRoutes = ['/auth']

export default async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    const cookie = (await cookies()).get('session')?.value
    const session = await decode(cookie)

    if (isProtectedRoute && !session?.user.id) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (
        isPublicRoute &&
        session?.user.id &&
        !req.nextUrl.pathname.startsWith('/')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}