import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react"
import Image from "next/image"

export default function MainNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()

    // Check if token exists (only in browser)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            setIsLoggedIn(!!token)
        }
    }, [router.pathname]) // re-check on route change

    // Remove token and redirect
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        router.push('/login')
    }

    return (
        <Navbar>
            <NavbarBrand>
                <Link href={isLoggedIn ? "/dashboard" : "/"}>
                    <Image src="/logo.png" alt="Stark Industries" width={180} height={70} />
                </Link>
            </NavbarBrand>

            <NavbarContent justify="end">
                {!isLoggedIn ? (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Link href="/login">Login</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} color="primary" href="/register" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </>
                ) : (
                    <>
                        <NavbarItem>
                            <Button color="danger" variant="flat" onPress={() => router.push('/admin')}>
                                Admin
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="default" variant="flat" onPress={() => router.push('/settings')}>
                                Settings
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="danger" variant="solid" onPress={handleLogout}>
                                Logout
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    )
}
