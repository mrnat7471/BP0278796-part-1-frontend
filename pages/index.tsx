import Image from "next/image";
import {Button, Card, CardBody, CardHeader, Divider, Link} from "@heroui/react";

export default function Home() {
  return (
    <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5 md:p-0">
            <h1 className="text-4xl font-bold mb-4">Welcome to Stark Industries' Staff Onboarding Portal</h1>
            <p className="text-lg mb-8">Changing the world for a better future — one genius at a time.</p>
            <Image src="/hero-image.png" alt="Hero Image" width={600} height={400} className="rounded-lg shadow-lg" />
            <p className={"mt-3"}>Scroll down to learn more...</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-200 p-8">
            <h2 className="text-3xl font-semibold mb-4">Get Started</h2>
            <p className="text-lg text-center">At Stark Industries, we are committed to innovation and excellence.<br/>
                We are investing in your future with cutting-edge technology and sustainable solutions.</p>
            <p className="mt-4">Join us in our mission to make the world a better place.</p>
            <div className={"flex flex-row gap-4 mt-4"}>
                <Button color="primary" variant="solid" size={"lg"} as={Link} href={"/login"}>
                    Login
                </Button>
                <Button color="success" variant="flat" size={"lg"} as={Link} href={"/register"}>
                    Sign Up
                </Button>
            </div>
        </div>
        <div className={"flex flex-col items-center justify-center p-8"}>
            <h2 className="text-3xl font-semibold mb-4">Your Journey Starts Here</h2>
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-center w-full">Register</h3>
                    </CardHeader>
                    <CardBody>
                        <p className={"text-center"}>Enter your details and receive a secure login link via email.</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-center w-full">Get Matched</h3>
                    </CardHeader>
                    <CardBody>
                        <p className={"text-center"}>We’ll tailor your learning path based on your new role.</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-center w-full">Start Training</h3>
                    </CardHeader>
                    <CardBody>
                        <p className={"text-center"}>Access curated resources and get mission-ready.</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    </div>
  );
}
