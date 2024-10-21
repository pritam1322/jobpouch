'use client'; 
import authOptions from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Header() {
    const { data: session, status } = useSession();
    console.log(session);
    return (
        <header className="flex items-center justify-between px-10 py-4 bg-black  shadow-lg">
            <div>
                <Link href="/" className="text-3xl font-extrabold text-white hover:text-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105">
                    JobPouch
                </Link>
            </div>
            <nav className="flex gap-10">
                {!!session && (
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

                    )
                }               
            </nav>
        </header>
    );
}
