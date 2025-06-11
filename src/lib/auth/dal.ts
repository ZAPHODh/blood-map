import 'server-only'

import { cookies } from 'next/headers'
import { decode } from './server-session'

import { cache } from 'react'
import { SESSION_COOKIE_NAME } from './helper'


export const verifySession = cache(async () => {
    const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value
    const session = await decode(cookie)
    return { session }
})

export const getUser = cache(async () => {
    const { session } = await verifySession()
    if (!session) return null
    const user = session.user
    return user
})