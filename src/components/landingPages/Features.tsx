'use client';
import React from "react";
import { ChartColumnBig, CircleCheck, ClipboardCheckIcon, Mail } from "lucide-react";

export default function Features(){
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Your Job Search</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">  
                        Everything you need to organize, track, and optimize your job search journey in one place.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                            <ClipboardCheckIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-semibold mb-3">Job Application Tracking</h1>
                        <p className="text-gray-600 mb-4">
                        Keep all your job applications organized in one place with status updates, deadlines, and follow-up reminders.
                        </p>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Status tracking</li>
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Deadline reamainder</li>
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Follow-up management</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                            <ChartColumnBig className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-semibold mb-3">Analytics & Insights</h1>
                        <p className="text-gray-600 mb-8">
                            Get detailed analytics and actionable insights to improve your job search strategy.
                        </p>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Success rate analysis</li>
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Performance metrics</li>
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Trend visualization</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                            <Mail className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-semibold mb-3">Template Generation</h1>
                        <p className="text-gray-600 mb-4">
                            Create personalized templates for emails and messages to save time and maintain consistency.
                        </p>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Email templates</li>
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> LinkedIn templates</li>
                            <li className="flex items-center"><CircleCheck fill={'#51ec70'} className="w-4 h-4 text-white mr-2" /> Email templates</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}