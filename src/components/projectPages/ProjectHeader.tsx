'use client';

import { AlignJustify } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";

export default function ProjectHeader() {

    const [mobileSection, setMobileSection] = useState(false);
    const [shadow, setShadow] = useState(false);

    const { data: session, status } = useSession();
    console.log(session);

    useEffect(() => {
        const handleScroll = () => setShadow(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileSection ? 'hidden' : 'auto';
    }, [mobileSection]);

    // Menu items.
    const menuItems = [
        {
        title: "Add Project",
        url: "#addproject"
        },
        {
        title: "Explore Projects",
        url: "#testimonials"
        },
        {
        title: "Trending",
        url: "#trending"
        },
        {
        title: "Search",
        url: "#search"
        }
    ]

    return (
        <header>

            <nav id="navbar" className={`w-full fixed z-50 bg-neutral-900 transition-shadow ${shadow ? "shadow-lg" : ""}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link 
                                href="/" 
                                className="text-2xl font-bold text-white"
                            >
                                JobPouch
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {menuItems.map((item, index) => (
                                    <Link key={index} href={item.url} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileSection(!mobileSection)}
                                aria-label="Toggle mobile menu"
                                className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                                <AlignJustify className="block h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileSection && (
                    <div className="md:hidden" id="mobile-menu">
                        <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {menuItems.map((item, index) => (
                                <Link key={index} href={item.url} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}