export default function Templates(){
    return(
        <section id="templates" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="bg-white rounded-xl shadow-2xl p-8 relative">
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 text-sm text-gray-500">To:</div>
                                        <div className="flex-1 h-8 bg-white border border-gray-200 rounded-md"></div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 text-sm text-gray-500">Subject:</div>
                                        <div className="flex-1 h-8 bg-white border border-gray-200 rounded-md"></div>
                                    </div>
                                    
                                    <div className="space-y-3 mt-6">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 mt-6">
                                        <div className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">
                                            Generate Template
                                        </div>
                                        <div className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md text-sm">
                                            Preview
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="animate__animated animate__fadeInRight">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Professional Templates at Your Fingertips
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Save time and maintain consistency with our smart template generation system for emails and LinkedIn messages.
                        </p>

                        {/* <!-- Template Features --> */}
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Templates</h3>
                                    <p className="text-gray-600">Customizable templates that adapt to different job applications and scenarios.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Dynamic Variables</h3>
                                    <p className="text-gray-600">Automatically populate templates with company names, job titles, and other relevant details.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Follow-up Sequences</h3>
                                    <p className="text-gray-600">Pre-built templates for different stages of the application process.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <a href="/email-generation" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                Try Template Generator
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}