import {ReactNode} from "react";
import MainNavbar from "@/components/Navbar";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <MainNavbar />
            <main>
                {children}
            </main>
            <footer className="bg-gray-200 p-4">
                <p>&copy; 2025 Stark Industries Inc. [BPP University Web Development Module (Assessment BP0278796)]</p>
            </footer>
        </div>
    );
}