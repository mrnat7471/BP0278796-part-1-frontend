import {useEffect} from "react";

export default function Logout() {
    useEffect(() => {
        // Clear the session storage
        sessionStorage.clear();

        // Redirect to the login page
        window.location.href = "/login";
    }, []);
}