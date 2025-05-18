import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@heroui/react'

// User type definition
type User = {
    id: string
    fullName: string
    email: string
    jobRole: string
    startDate: string
    learningPathId?: string | null
}

type LearningPath = {
    id: string
    title: string
    role: string
    courses: { id: string; name: string }[]
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('You must be logged in to access the dashboard')
            router.push('/login')
            return
        }

        // Fetch user profile
        fetch('/api/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.error || 'Authentication failed')
                    })
                }
                return res.json()
            })
            .then(data => {
                setUser(data.user)

                // If user has an assigned learning path, fetch its details
                if (data.user.learningPathId) {
                    return fetch('/api/active-path', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(data => setLearningPath(data.learningPath))
                }
            })
            .catch(err => {
                console.error(err)
                alert('Session expired or invalid. Please login again.')
                localStorage.removeItem('token')
                router.push('/login')
            })
            .finally(() => setLoading(false))
    }, [router])

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6">Hello, {user.fullName}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {/* Info summary */}
                <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="mb-2"><strong>Start Date:</strong> {new Date(user.startDate).toLocaleDateString()}</p>
                <p className="mb-4"><strong>Job Role:</strong> {user.jobRole}</p>

                {/* Learning Path Summary */}
                {learningPath && (
                    <div className="mb-4 text-sm text-gray-700">
                        <p><strong>Learning Path:</strong> {learningPath.title}</p>
                        <p><strong>Courses:</strong> {learningPath.courses.length}</p>
                    </div>
                )}

                {/* Conditional Button */}
                {user.learningPathId ? (
                    <Button
                        onClick={() => router.push('/learning-paths')}
                        color="primary"
                        variant="solid"
                        fullWidth
                    >
                        View My Learning Path
                    </Button>
                ) : (
                    <Button
                        onClick={() => router.push('/learning-paths/selection')}
                        color="primary"
                        variant="solid"
                        fullWidth
                    >
                        Choose Your Learning Path
                    </Button>
                )}
            </div>
        </div>
    )
}
