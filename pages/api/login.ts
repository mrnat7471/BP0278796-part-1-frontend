// Import required types and libraries
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'         // ORM for interacting with the database
import nodemailer from 'nodemailer'                   // Used to send the magic login email
import { randomUUID } from 'crypto'                   // Generates a secure random token

// Initialise Prisma client
const prisma = new PrismaClient()

// Default export for Next.js API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests to this endpoint
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Extract email from request body
    const { email } = req.body

    // Basic validation to ensure email is present and is a string
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid email' })
    }

    // Look up user by email in the database
    const user = await prisma.user.findUnique({ where: { email } })

    // If no user is found, return an error
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    // Generate a unique login token
    const token = randomUUID()

    // Set the token to expire in 10 minutes
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

    // Save the magic link token in the database for verification later
    await prisma.magicLink.create({
        data: {
            email,
            token,
            expiresAt
        }
    })

    // Construct the full login link that the user will click
    const link = `${process.env.BASE_URL}/verify?token=${token}`

    // Configure Nodemailer transport using .env variables
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '1025'),
        auth: process.env.EMAIL_SERVER_USER
            ? {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASS,
            }
            : undefined,
    })

    // Send the magic login email to the user
    await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Your Stark Industries Login Link',
        html: `
      <p>Welcome back,</p>
      <p>Click below to log in to your onboarding portal:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 10 minutes.</p>
    `
    })

    // Respond to the frontend that the magic link has been sent
    return res.status(200).json({ message: 'Magic login link sent' })
}
