import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from '@/lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Authenticate user from bearer token
    const user = getUserFromToken(req.headers.authorization)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorised' })
    }

    // Extract path ID from request body
    const { learningPathId } = req.body
    if (!learningPathId) {
        return res.status(400).json({ error: 'Missing learningPathId' })
    }

    // Update user’s record with selected learning path
    await prisma.user.update({
        where: { id: user.sub },
        data: { learningPathId }
    })

    return res.status(200).json({ message: 'Learning path saved successfully' })
}
