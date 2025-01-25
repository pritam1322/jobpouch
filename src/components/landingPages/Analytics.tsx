'use client';
import React from "react";

export default function Analytics(){
    return (
        <section id="analytics" className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/*Left Content*/}
                <div className="animate__animated animate__fadeInLeft">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Make Data-Driven Decisions in Your Job Search
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Transform your job search strategy with powerful analytics and insights that help you understand what works and what doesn't.
                    </p>
                    
                    {/*Analytics Features*/}
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Success Rate Analysis</h3>
                                <p className="text-gray-400">Track application outcomes and identify patterns in successful applications to optimize your approach.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Performance Metrics</h3>
                                <p className="text-gray-400">Get detailed insights into response rates, interview conversions, and overall application performance.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Trend Visualization</h3>
                                <p className="text-gray-400">Visual reports and charts help you understand trends and make informed decisions.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Right Content - Analytics Dashboard Preview*/}
                <div className="animate__animated animate__fadeInRight">
                    <div className="bg-neutral-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
                        
                        {/*Dashboard Header*/}
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-white font-semibold">Application Analytics</h4>
                            <div className="flex space-x-2">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        {/*Charts Preview*/}
                        <div className="space-y-6">
                            {/*Bar Chart Preview*/}
                            <div className="h-32 flex items-end space-x-2">
                                <div className="w-1/6 h-20 bg-indigo-600 rounded-t animate-pulse"></div>
                                <div className="w-1/6 h-24 bg-indigo-500 rounded-t animate-pulse"></div>
                                <div className="w-1/6 h-16 bg-indigo-600 rounded-t animate-pulse"></div>
                                <div className="w-1/6 h-28 bg-indigo-500 rounded-t animate-pulse"></div>
                                <div className="w-1/6 h-20 bg-indigo-600 rounded-t animate-pulse"></div>
                                <div className="w-1/6 h-32 bg-indigo-500 rounded-t animate-pulse"></div>
                            </div>

                            {/*Stats Preview*/}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-neutral-700 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Success Rate</p>
                                    <p className="text-white text-xl font-bold">68%</p>
                                </div>
                                <div className="bg-neutral-700 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Applications</p>
                                    <p className="text-white text-xl font-bold">124</p>
                                </div>
                                <div className="bg-neutral-700 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Interviews</p>
                                    <p className="text-white text-xl font-bold">28</p>
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