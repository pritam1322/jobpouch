export default function Pricing(){
    return (
        <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 animate__animated animate__fadeIn">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Choose the perfect plan for your job search journey
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate__animated animate__fadeInLeft hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                        <p className="text-gray-600 mb-6">Perfect for getting started</p>
                        <div className="text-4xl font-bold text-gray-900 mb-6">
                            Free
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Track up to 10 applications</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Basic analytics</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">3 email templates</span>
                        </li>
                    </ul>
                    <div className="text-center">
                        <a href="#" className="inline-block w-full py-3 px-6 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200">
                            Get Started
                        </a>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-neutral-900 rounded-2xl shadow-xl p-8 animate__animated animate__fadeInUp md:-mt-8 relative hover:shadow-2xl transition-shadow duration-300">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-tr-lg rounded-bl-lg text-sm font-medium">
                        Popular
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                        <p className="text-gray-400 mb-6">For serious job seekers</p>
                        <div className="text-4xl font-bold text-white mb-6">
                            $12<span className="text-lg font-normal text-gray-400">/month</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-300">Unlimited applications</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-300">Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-300">Unlimited templates</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-300">Priority support</span>
                        </li>
                    </ul>
                    <div className="text-center">
                        <a href="#" className="inline-block w-full py-3 px-6 text-center text-indigo-600 bg-white hover:bg-gray-50 rounded-lg transition duration-200">
                            Start Pro Trial
                        </a>
                    </div>
                </div>

                {/* Team Plan */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate__animated animate__fadeInRight hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Team</h3>
                        <p className="text-gray-600 mb-6">For career coaches &amp; teams</p>
                        <div className="text-4xl font-bold text-gray-900 mb-6">
                            $29<span className="text-lg font-normal text-gray-600">/month</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Everything in Pro</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Team collaboration</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Admin dashboard</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Custom branding</span>
                        </li>
                    </ul>
                    <div className="text-center">
                        <a href="#" className="inline-block w-full py-3 px-6 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200">
                            Contact Sales
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}