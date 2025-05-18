import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Type definitions for learning path and course
type Course = {
    id: string
    name: string
}

type LearningPath = {
    title: string
    role: string
    courses: Course[]
}

type UserMeta = {
    jobRole: string
    startDate: string
}

export default function MyPathPage() {
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
    const [userMeta, setUserMeta] = useState<UserMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')

        if (!token || !user) {
            router.push('/login')
            return
        }

        // Parse basic user info for display
        const parsedUser = JSON.parse(user)
        setUserMeta({
            jobRole: parsedUser.jobRole,
            startDate: parsedUser.startDate,
        })

        // Fetch learning path and courses
        fetch('/api/active-path', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.learningPath) {
                    throw new Error('No learning path found')
                }
                setLearningPath(data.learningPath)
            })
            .catch((err) => {
                console.error(err)
                alert('Failed to load learning path')
                router.push('/dashboard')
            })
            .finally(() => setLoading(false))
    }, [router])

    if (loading || !learningPath || !userMeta) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl">Loading your learning path...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Your Learning Path</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
                {/* Basic info */}
                <p className="mb-2"><strong>Job Role:</strong> {userMeta.jobRole}</p>
                <p className="mb-2"><strong>Start Date:</strong> {new Date(userMeta.startDate).toLocaleDateString()}</p>
                <p className="mb-4"><strong>Path Title:</strong> {learningPath.title}</p>

                <hr className="my-4" />

                {/* Course list */}
                <h2 className="text-xl font-semibold mb-4">Courses</h2>
                <ul className="space-y-2">
                    {learningPath.courses.map((course, index) => (
                        <li key={course.id} className="p-3 bg-gray-50 rounded shadow-sm flex justify-between items-center cursor-pointer">
                            <span>{index + 1}. {course.name}</span>
                            <span className="text-sm text-gray-500">Progress: 0%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
