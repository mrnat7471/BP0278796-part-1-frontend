import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function VerifyPage() {
    // Local state to manage loading and result message
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Get the token from the URL query
        const token = router.query.token as string

        // Wait for token to be available
        if (!token) return

        // Send token to backend for verification
        fetch(`/api/verify?token=${token}`)
            .then((res) => {
                if (!res.ok) {
                    // If the token is invalid or expired
                    return res.json().then((data) => {
                        throw new Error(data.error || 'Verification failed')
                    })
                }
                return res.json()
            })
            .then((data) => {
                // Save JWT token to localStorage for future authenticated requests
                localStorage.setItem('token', data.token)

                // Optional: Save user data (for display or context)
                localStorage.setItem('user', JSON.stringify(data.user))

                // Show success message
                setStatus('success')
                setMessage(`Welcome, ${data.user.fullName}! Redirecting to your dashboard...`)

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            })
            .catch((err) => {
                // Handle errors and show failure message
                console.error(err)
                setStatus('error')
                setMessage(err.message || 'Something went wrong')
            })
    }, [router.query.token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">
                {status === 'loading' && 'Verifying...'}
                {status === 'success' && 'Verified!'}
                {status === 'error' && 'Verification Failed'}
            </h1>
            <p className="text-lg text-gray-700">{message}</p>
        </div>
    )
}
