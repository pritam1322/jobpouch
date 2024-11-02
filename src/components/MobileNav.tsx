"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

const MobileNav = () => {
    const router = useRouter();
    const [showOptions, setShowOptions] = useState(false);
    const { data: session } = useSession();

    const handleNavigation = (path: string) => {
        router.push(path);
        setShowOptions(false); // Hide options after navigation
    };

    return (
        <section>
            <nav className="flex flex-col items-start gap-2 lg:hidden md:hidden relative">
                {/* Menu Icon */}
                <button 
                    aria-label="Open menu" 
                    aria-expanded={showOptions}
                    onClick={() => setShowOptions(!showOptions)}
                    className="focus:outline-none"
                >
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-gray-700" />
                </button>
                
                {showOptions && (
                    <div className="flex flex-col gap-2 mt-2 border border-gray-50 bg-black shadow-lg rounded-lg p-2 absolute top-7 right-5">
                        {!session ? (
                            <>
                                <button
                                    onClick={() => handleNavigation("/signup")}
                                    className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md"
                                >
                                    Signup
                                </button>
                                <button
                                    onClick={() => handleNavigation("/login")}
                                    className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md"
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigation("/account")}
                                    className="w-full px-4 py-2 text-left hover:text-black hover:bg-white rounded-md"
                                >
                                    Hello, {session?.user?.name}
                                </button>
                                <LogoutButton />
                            </>
                        )}
                    </div>
                )}
            </nav>
        </section>
    );
};

export default MobileNav;
