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

    const { fullName, jobRole, startDate } = req.body

    // Validate input
    if (!fullName || !jobRole || !startDate) {
        return res.status(400).json({ error: 'Missing fields' })
    }

    // Update the user in the database
    const updated = await prisma.user.update({
        where: { id: user.sub },
        data: {
            fullName,
            jobRole,
            startDate: new Date(startDate),
        }
    })

    return res.status(200).json({
        message: 'Profile updated',
        user: {
            id: updated.id,
            email: updated.email,
            fullName: updated.fullName,
            jobRole: updated.jobRole,
            startDate: updated.startDate,
            learningPathId: updated.learningPathId ?? null
        }
    })
}
