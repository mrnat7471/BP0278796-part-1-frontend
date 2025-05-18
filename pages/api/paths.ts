import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from '@/lib/auth' // assumes you’ve added this helper

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Optional: Verify user token for protected access
    const user = getUserFromToken(req.headers.authorization)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorised' })
    }

    // Get the job role from query string
    const role = req.query.role as string
    if (!role) {
        return res.status(400).json({ error: 'Missing role parameter' })
    }

    // Fetch all learning paths matching the user’s role and include course list
    const paths = await prisma.learningPath.findMany({
        where: { role },
        include: {
            courses: true
        }
    })

    return res.status(200).json({ paths })
}
