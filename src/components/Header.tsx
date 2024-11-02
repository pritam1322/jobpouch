'use client';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import MobileNav from "./MobileNav";

export default function Header() {
    const { data: session, status } = useSession();
    console.log(session);

    return (
        <header className="flex items-center justify-between px-10 py-4 bg-black shadow-lg">
            <div className="flex gap-16 items-center">
                <Link 
                    href="/" 
                    className="text-3xl font-extrabold text-white hover:text-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    JobPouch
                </Link>
                <div className="text-white flex gap-1 text-lg font-semibold items-center">
                    <FontAwesomeIcon icon={faGithub} className="h-4" />
                    <Link 
                        href="https://github.com/pritam1322/jobpouch" 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Github
                    </Link>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex gap-10">
                {!!session && status == 'authenticated' && (
                    <div className="flex gap-8 items-center">
                        <Link href={'/account'}>
                            Hello, {session?.user?.name}
                        </Link>
                        <LogoutButton />
                    </div>
                )}
                {!session && (
                    <>
                        <Link href="/signup" className="text-lg text-gray-400 hover:text-white transition-colors duration-300 ease-in-out">
                            SignUp
                        </Link>
                        <Link href="/login" className="text-lg text-gray-400 hover:text-white transition-colors duration-300 ease-in-out">
                            Login
                        </Link>
                    </>
                )}
            </nav>

            {/* Mobile Navigation */}
            <div className="sm:hidden">
                <MobileNav />
            </div>
        </header>
    );
}
