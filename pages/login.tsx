import { Button, Input } from "@heroui/react"
import { FormEvent } from "react"

export default function Login() {

    // Handles the login form submission
    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const email = form.emailaddress.value.trim()

        // Validate that the email field is filled
        if (!email) {
            alert("Please enter your email")
            return
        }

        // Basic email format validation
        if (!email.includes('@') || !email.includes('.')) {
            alert("Please enter a valid email")
            return
        }

        // Prepare the payload to send to the API
        const data = { email }

        // Send a POST request to /api/login
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        throw new Error(data.error || 'Something went wrong')
                    })
                }
                return res.json()
            })
            .then(() => {
                alert('Magic link sent! Please check your inbox.')
                form.reset()
            })
            .catch((err) => {
                console.error(err)
                alert(err.message || 'Failed to send magic link')
            })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 -mt-16 -mb-14">
            <h1 className="text-4xl font-bold mb-6">Login</h1>

            {/* Login form */}
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <Input
                    name="emailaddress"
                    className="mb-4"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    required
                    isRequired
                />

                <Button
                    type="submit"
                    className="w-full"
                    color="primary"
                    variant="solid"
                    fullWidth
                >
                    Login
                </Button>
            </form>
        </div>
    )
}
