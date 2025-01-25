'use client';
import React from "react";
import { CircleCheck, CirclePlay, MoveRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function Hero(){

    const { data: session, status } = useSession();
    let redirectLink = '/signup' ;

    if (status !== 'unauthenticated') {
        redirectLink = '/viewJobApplication'
    }

    return (
        <section className="bg-neutral-900 min-h-[70vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-13 items-center py-16">
                    {/* Left Content */}
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Simplify Your
                            <span className="text-indigo-500"> Job Tracking </span>
                            Journey
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-8">
                            {/* Track applications, generate templates, and get insights to land your dream job faster with JobPouch&apos;s all-in-one platform. */}
                            Stay ahead in your job search with real-time tracking and personalized application management.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={redirectLink} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg">
                                Get Started Free
                                <MoveRight className="ml-2 -mr-1 w-5 h-5"/>
                            </Link>
                            <Link href='/' className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-300 hover:bg-gray-800 md:text-lg">
                                Watch Demo
                                <CirclePlay className="ml-2 -mr-1 w-5 h-5"/>
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center space-x-4 text-gray-400">
                            <div className="flex items-center">
                                <CircleCheck fill="#969696" color={'black'} className="w-5 h-5 mr-1"/>
                                Free 14-day trial
                            </div>
                            <div className="flex items-center">
                                <CircleCheck fill="#969696" color={'black'} className="w-5 h-5 mr-1"/>
                                No credit card required
                            </div>
                        </div>
                        
                    </div>

                    {/* right Content */}
                    <div className="relative bg-neutral-800 rounded-xl p-6 shadow-2xl mt-8">
                        <div className="flex items-center mb-4">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="ml-4 bg-neutral-700 rounded-full px-4 py-1 text-sm text-gray-300">
                                app.jobpouch.com
                            </div>
                        </div>

                        {/* Demo Content */}
                        <div className="space-y-6">
                            <div className="bg-neutral-700 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-semibold">Application Dashboard</h3>
                                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">Add New</button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-neutral-800 p-3 rounded-lg">
                                        <p className="text-gray-400 text-sm">Active</p>
                                        <p className="text-white text-xl font-bold">12</p>
                                    </div>
                                    <div className="bg-neutral-800 p-3 rounded-lg">
                                        <p className="text-gray-400 text-sm">Interviews</p>
                                        <p className="text-white text-xl font-bold">5</p>
                                    </div>
                                    <div className="bg-neutral-800 p-3 rounded-lg">
                                        <p className="text-gray-400 text-sm">Success Rate</p>
                                        <p className="text-white text-xl font-bold">42 %</p>
                                    </div>
                                </div>
                                {/* Application List */}
                                <div className="space-y-3">
                                    <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-white font-medium">Senior Developer</h4>
                                                <p  className="text-gray-400 text-sm">TechCorp Inc.</p>
                                            </div>
                                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Interview</span>
                                        </div>
                                    </div>
                                    <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-white font-medium">Product Designer</h4>
                                                <p  className="text-gray-400 text-sm">Design Studios</p>
                                            </div>
                                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">Applied</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}