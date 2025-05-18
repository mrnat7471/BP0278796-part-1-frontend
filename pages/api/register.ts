// Import required types and libraries
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'         // ORM for database access
import nodemailer from 'nodemailer'                   // Used to send magic email links
import { randomUUID } from 'crypto'                   // Generates secure unique tokens

// Initialise Prisma client for querying the database
const prisma = new PrismaClient()

// API route handler for POST /api/register
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests to this route
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Extract data from request body
  const { fullName, email, startDate, jobRole } = req.body

  // Validate that all required fields are provided
  if (!fullName || !email || !startDate || !jobRole) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Check if the user already exists in the database
  const existingUser = await prisma.user.findUnique({ where: { email } })

  // If the user does not exist, create a new user with the provided information
  let user = existingUser
  if (!existingUser) {
    user = await prisma.user.create({
      data: {
        email,
        fullName,
        startDate: new Date(startDate),
        jobRole,
      }
    })
  }

  if(existingUser) {
    return res.status(400).json({ error: 'User already exists' })
  }

  // Generate a secure random token for magic link authentication
  const token = randomUUID()

  // Set the token to expire in 10 minutes
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

  // Save the token in the database for later verification
  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt
    }
  })

  // Build the full login link the user will click to verify
  const link = `${process.env.BASE_URL}/verify?token=${token}`

  // Configure the SMTP transporter using environment variables (works with MailHog)
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

  // Send the email containing the magic login link
  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Your Stark Industries Login Link',
    html: `<p>Hello ${fullName},</p>
           <p>Click the link below to log in to your onboarding portal:</p>
           <a href="${link}">${link}</a>
           <p>This link will expire in 10 minutes.</p>`
  })

  // Respond with success message
  return res.status(200).json({ message: 'Magic link sent' })
}
