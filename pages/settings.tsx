import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Input, DatePicker, Select, SelectItem } from '@heroui/react'
import { getLocalTimeZone, parseDate } from '@internationalized/date'

const jobRoles = [
    { key: 'Developer', label: 'Developer' },
    { key: 'Designer', label: 'Designer' },
    { key: 'Sales', label: 'Sales' },
    { key: 'HR', label: 'HR' }
]

export default function EditProfilePage() {
    const [fullName, setFullName] = useState('')
    const [jobRole, setJobRole] = useState('')
    const [startDate, setStartDate] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            router.push('/login')
            return
        }

        // Fetch user profile
        fetch('/api/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const user = data.user
                setFullName(user.fullName)
                setJobRole(user.jobRole)
                setStartDate(parseDate(user.startDate.split('T')[0])) // Convert to DateValue
            })
            .catch(err => {
                console.error(err)
                alert('Failed to load user profile')
                router.push('/dashboard')
            })
            .finally(() => setLoading(false))
    }, [router])

    const handleSubmit = () => {
        const token = localStorage.getItem('token')

        if (!token || !fullName || !jobRole || !startDate) {
            alert('Please complete all fields.')
            return
        }

        fetch('/api/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                fullName,
                jobRole,
                startDate: startDate.toString() // will be a yyyy-mm-dd string
            })
        })
            .then(res => {
                if (!res.ok) throw new Error()
                alert('Profile updated successfully!')
                router.push('/dashboard')
            })
            .catch(() => {
                alert('Failed to update profile')
            })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
                <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    isRequired
                    className="w-full"
                />

                <Select
                    label="Job Role"
                    selectedKeys={new Set([jobRole])}
                    onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]
                        if (selected) setJobRole(selected.toString())
                    }}
                    items={jobRoles}
                >
                    {(role) => <SelectItem key={role.key}>{role.label}</SelectItem>}
                </Select>

                <Button color="primary" fullWidth onPress={handleSubmit}>
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
