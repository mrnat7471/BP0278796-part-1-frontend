import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from '@/lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Authenticate user from bearer token
    const user = getUserFromToken(req.headers.authorization)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorised' })
    }

    // Fetch the full user including related learning path and its courses
    const dbUser = await prisma.user.findUnique({
        where: { id: user.sub },
        include: {
            learningPath: {
                include: {
                    courses: true,
                }
            }
        }
    })

    if (!dbUser) {
        return res.status(404).json({ error: 'User not found' })
    }

    if (!dbUser.learningPath) {
        return res.status(200).json({ learningPath: null })
    }

    return res.status(200).json({
        learningPath: {
            id: dbUser.learningPath.id,
            title: dbUser.learningPath.title,
            role: dbUser.learningPath.role,
            courses: dbUser.learningPath.courses.map(course => ({
                id: course.id,
                name: course.name
            }))
        }
    })
}
