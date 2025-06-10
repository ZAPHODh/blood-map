import 'server-only'

import { cookies } from 'next/headers'
import { decode } from './server-session'

import { cache } from 'react'


export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decode(cookie)
    return { isAuth: true, session }
})

export const getUser = cache(async () => {
    const { session } = await verifySession()
    if (!session) return null
    const user = session.user
    return user
})