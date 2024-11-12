'use client';
import { faChartSimple, faFile, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobHeader(){
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showOptions, setShowOptions] = useState(false);

    if (status === 'unauthenticated') {
        router.push('/');
    }

    const handleNavigation = (path: string) => {
        router.push(path);
        setShowOptions(false); // Close dropdown after navigation
    };

    return (
        <header>
            <div className="flex justify-between text-gray-300 bg-neutral-800 pt-4 pb-2 px-8 items-center">
                {/* Left Section - Main Links */}
                <div className="flex gap-8 items-center">
                    <div className="items-center flex gap-2 hover:bg-neutral-600 p-2 rounded-md">
                        {/* <FontAwesomeIcon icon={faAddressCard} className="h-8" /> */}
                        <Link href={'/viewJobApplication'} className="font-bold  hidden sm:inline">
                            {session?.user?.name}
                        </Link>
                    </div>
                    <div className="items-center  gap-1 hidden sm:flex hover:bg-neutral-600 p-2  rounded-md">
                        {/* <FontAwesomeIcon icon={faChartSimple} className="h-5" /> */}
                        <Link href={'/stats'} className="text-md font-semibold">Statistics</Link>
                    </div>
                    <div className="items-center gap-1 hidden sm:flex hover:bg-neutral-600 p-2 rounded-md">
                        {/* <FontAwesomeIcon icon={faFile} className="h-5" /> */}
                        <Link href={'/resume'} className="text-md font-semibold">Resume</Link>
                    </div>
                </div>

                {/* Right Section - Home and Email */}
                <div className="items-center gap-8 hidden sm:flex hover:bg-neutral-600 p-2 rounded-md">
                    <Link href={'/'} className="font-semibold">Home</Link>
                </div>

                {/* Mobile Menu Icon */}
                <button 
                    aria-label="Open menu"
                    aria-expanded={showOptions}
                    onClick={() => setShowOptions(!showOptions)}
                    className="sm:hidden focus:outline-none"
                >
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-black" />
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {showOptions && (
                <div className="flex flex-col gap-2 mt-2 border border-gray-50 text-white bg-black shadow-lg rounded-lg p-2 sm:hidden">
                    <button
                        onClick={() => handleNavigation("/viewJobApplication")}
                        className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md"
                    >
                        {session?.user?.name}&apos;s Applications
                    </button>
                    <button
                        onClick={() => handleNavigation("/stats")}
                        className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faChartSimple} />
                        Statistics
                    </button>
                    <button
                        onClick={() => handleNavigation("/resume")}
                        className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faFile} />
                        Resume
                    </button>
                    <button
                        onClick={() => handleNavigation("/")}
                        className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md"
                    >
                        Home
                    </button>
                    
                </div>
            )}
        </header>
    );
}
