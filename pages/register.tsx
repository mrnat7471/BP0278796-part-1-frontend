import {Button, DatePicker, Input, Link, Select, SelectItem} from "@heroui/react";
import {getLocalTimeZone, today} from "@internationalized/date";
import {FormEvent} from "react";

const jobRoles = [
    {key: "Developer", label: "Developer"},
    {key: "Designer", label: "Designer"},
    {key: "Sales", label: "Sales"},
    {key: "HR", label: "HR"}
]


export default function Register() {

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        const fullName = form.fullname.value.trim();
        const email = form.emailaddress.value.trim();
        const startDate = form.startDate.value;
        const jobRole = form.jobRole.value;

        if (!fullName || !email || !startDate || !jobRole) {
            alert("Please fill out all fields.");
            return;
        }

        const payload = {
            fullName,
            email,
            startDate,
            jobRole
        };

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        throw new Error(data.error || 'Something went wrong');
                    });
                }
                return res.json();
            })
            .then(() => {
                alert('Magic link sent! Check your inbox.');
                form.reset();
            })
            .catch((err) => {
                console.error(err);
                alert(err.message || 'Failed to send magic link');
            });
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 -mt-16 -mb-14">
                <h1 className="text-4xl font-bold mb-6">Register</h1>
                <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                    <Input className={"mb-4"} name={"fullname"} label={"Full Name"} placeholder={"Enter your full name"} required isRequired />
                    <Input className={"mb-4"} name={"emailaddress"} type={"email"} label={"Email"} placeholder={"Enter your email"} required isRequired />
                    <DatePicker name={"startDate"} className="w-full mb-4" label={"Start Date"} isRequired defaultValue={today(getLocalTimeZone())} />
                    <Select
                        name={"jobRole"}
                        className={"mb-4"}
                        items={jobRoles}
                        label="Job Roles"
                        placeholder="Select an job role"
                    >
                        {(role) => <SelectItem>{role.label}</SelectItem>}
                    </Select>
                    <Button type={"submit"} className={"w-full"} color="primary" variant="solid" fullWidth>
                        Register
                    </Button>
                    <Link href={"/login"} className={"mt-2"}>Got an account? Click here</Link>
                </form>
            </div>
        </>
    )
}