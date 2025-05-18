import jwt from 'jsonwebtoken'

type UserPayload = {
    sub: string
    email: string
    role: string
    iat?: number
    exp?: number
}

export function getUserFromToken(authHeader: string | undefined): UserPayload | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null

    const token = authHeader.replace('Bearer ', '')

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload
        return payload
    } catch {
        return null
    }
}
