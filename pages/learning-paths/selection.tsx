import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, RadioGroup, Radio } from '@heroui/react'

type Course = {
    id: string
    name: string
}

type LearningPath = {
    id: string
    role: string
    title: string
    courses: Course[]
}

export default function LearningPathPage() {
    const [user, setUser] = useState<any>(null)
    const [paths, setPaths] = useState<LearningPath[]>([])
    const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Load user from localStorage
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (!storedUser || !token) {
            router.push('/login')
            return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)

        // Fetch learning paths for this user's role
        fetch(`/api/paths?role=${userData.jobRole}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setPaths(data.paths))
            .catch(err => {
                console.error(err)
                alert('Could not load learning paths')
            })
    }, [router])

    // Handle saving the selected path
    const handleSubmit = () => {
        const token = localStorage.getItem('token')

        if (!selectedPathId || !token) {
            alert('Please select a learning path')
            return
        }

        fetch('/api/save-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ learningPathId: selectedPathId })
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to save path')
                return res.json()
            })
            .then(() => {
                alert('Learning path saved!')
                router.push('/dashboard')
            })
            .catch(err => {
                console.error(err)
                alert('Error saving learning path')
            })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Recommended Paths for {user?.jobRole}
            </h1>

            {/* List of learning paths */}
            <RadioGroup
                label="Select a learning path"
                value={selectedPathId ?? ''}
                onValueChange={setSelectedPathId}
                className="mb-6 w-full max-w-2xl"
            >
                {paths.map((path) => (
                    <Radio key={path.id} value={path.id} className="mb-4 p-4 rounded border bg-white shadow">
                        <div className="font-semibold text-lg">{path.title}</div>
                        <div className="text-sm text-gray-500 mb-2">For role: {path.role}</div>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                            {path.courses.map((course) => (
                                <li key={course.id}>{course.name}</li>
                            ))}
                        </ul>
                    </Radio>
                ))}
            </RadioGroup>

            {/* Save button */}
            <Button color="primary" variant="solid" onClick={handleSubmit}>
                Save & Continue
            </Button>
        </div>
    )
}
