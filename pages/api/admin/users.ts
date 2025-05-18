import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from '@/lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = getUserFromToken(req.headers.authorization)

    const search = req.query.search?.toString().toLowerCase() || ''
    const jobRole = req.query.jobRole?.toString()

    const users = await prisma.user.findMany({
        include: { learningPath: true },
        orderBy: { fullName: 'asc' }
    })

    const filtered = users.filter(u =>
        (!jobRole || u.jobRole === jobRole) &&
        (
            u.fullName.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        )
    )

    return res.status(200).json({ users: filtered })
}
