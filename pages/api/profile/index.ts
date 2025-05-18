import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from '@/lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Validate and decode token
    const user = getUserFromToken(req.headers.authorization)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorised' })
    }

    // Fetch user details including learningPathId
    const dbUser = await prisma.user.findUnique({
        where: { id: user.sub }
    })

    if (!dbUser) {
        return res.status(404).json({ error: 'User not found' })
    }

    // Return user profile including learningPathId
    return res.status(200).json({
        user: {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.fullName,
            jobRole: dbUser.jobRole,
            startDate: dbUser.startDate,
            learningPathId: dbUser.learningPathId ?? null
        }
    })
}
