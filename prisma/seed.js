import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.course.deleteMany()
    await prisma.learningPath.deleteMany()

    const paths = [
        {
            key: 'Developer',
            label: 'Developer',
            courses: [
                'Welcome to the Codebase',
                'Stark API Fundamentals',
                'Version Control with Git',
                'Secure Coding Practices',
            ]
        },
        {
            key: 'Designer',
            label: 'Designer',
            courses: [
                'Designing for Stark Tech',
                'UI/UX Foundations',
                'Accessibility Guidelines',
                'Figma & Prototyping Tools',
            ]
        },
        {
            key: 'Sales',
            label: 'Sales',
            courses: [
                'Stark Industries Product Line',
                'CRM & Lead Management',
                'Client Engagement Strategy',
                'Sales Pitch Workshop',
            ]
        },
        {
            key: 'HR',
            label: 'HR',
            courses: [
                'Company Culture & Values',
                'Onboarding Best Practices',
                'Conflict Resolution Techniques',
                'People Analytics 101',
            ]
        },
    ]

    for (const path of paths) {
        const learningPath = await prisma.learningPath.create({
            data: {
                role: path.key,
                title: `${path.label} Onboarding Path`,
            }
        })

        await Promise.all(path.courses.map(course =>
            prisma.course.create({
                data: {
                    name: course,
                    learningPathId: learningPath.id
                }
            })
        ))
    }

    console.log('Seeded learning paths and courses')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
