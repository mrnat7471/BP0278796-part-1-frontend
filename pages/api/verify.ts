import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const token = req.query.token as string
    if (!token) return res.status(400).json({ error: 'Token is required' })

    const magicLink = await prisma.magicLink.findUnique({ where: { token } })

    if (!magicLink || magicLink.expiresAt < new Date() || magicLink.used) {
        return res.status(400).json({ error: 'Invalid or expired token' })
    }

    await prisma.magicLink.update({ where: { token }, data: { used: true } })

    const user = await prisma.user.findUnique({ where: { email: magicLink.email } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Create JWT payload
    const payload = {
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        jobRole: user.jobRole,
        startDate: user.startDate,
    }

    // Sign JWT (expires in 1 hour)
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '24h'
    })

    return res.status(200).json({
        message: 'Login successful',
        token: jwtToken,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            jobRole: user.jobRole,
            startDate: user.startDate,
        }
    })
}