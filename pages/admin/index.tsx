import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Button } from '@heroui/react'

const jobRoles = ['Developer', 'Designer', 'Sales', 'HR']

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }

        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (filter) params.append('jobRole', filter)

        fetch(`/api/admin/users?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setUsers(data.users))
            .catch(err => {
                console.error(err)
                alert('Failed to load admin data')
            })
            .finally(() => setLoading(false))
    }, [search, filter, router])

    const handleExport = () => {
        const csv = [
            ['Name', 'Email', 'Job Role', 'Start Date', 'Learning Path'],
            ...users.map(u => [
                u.fullName,
                u.email,
                u.jobRole,
                new Date(u.startDate).toLocaleDateString(),
                u.learningPath?.title || ''
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'hires.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                    type="text"
                    label="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2"
                />
                <Select
                    label="Filter by job role"
                    selectedKeys={filter ? new Set([filter]) : new Set()}
                    onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0]
                        setFilter(value?.toString() || '')
                    }}
                >
                    {jobRoles.map(role => (
                        <SelectItem key={role}>{role}</SelectItem>
                    ))}
                </Select>
                <Button onPress={handleExport} color="secondary" className="md:ml-auto my-auto">
                    Export CSV
                </Button>
            </div>

            <Table isStriped>
                <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Job Role</TableColumn>
                    <TableColumn>Start Date</TableColumn>
                    <TableColumn>Learning Path</TableColumn>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.jobRole}</TableCell>
                            <TableCell>{new Date(user.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>{user.learningPath?.title || '—'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
