import { Star } from "lucide-react";

export default function Testimonials(){
    return(
        <section id="testimonials" className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 animate__animated animate__fadeIn">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    What Our Users Say
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Join thousands of successful job seekers who transformed their job search with JobPouch
                </p>
            </div>

            {/* Testimonials Slider */}
            <div className="testimonials-slider relative">
                <div className="overflow-hidden">
                    <div className="testimonials-track flex transition-transform duration-500">
                        {/* Testimonial 1 */}
                        <div className="testimonial-card w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                            <div className="bg-neutral-800 p-8 rounded-xl shadow-lg">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                        SK
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-white font-semibold">Sarah Kim</h4>
                                        <p className="text-gray-400">Software Engineer</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6">
                                &quot;JobPouch made my job search so much more organized. The analytics helped me understand what was working and what wasn&apos;t. Landed my dream job in 6 weeks!&quot;
                                </p>
                                <div className="flex text-yellow-400">
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="testimonial-card w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                            <div className="bg-neutral-800 p-8 rounded-xl shadow-lg">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                        JD
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-white font-semibold">James Davidson</h4>
                                        <p className="text-gray-400">Marketing Manager</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6">
                                &quot;The template generator saved me hours of work. I could focus on preparing for interviews instead of writing follow-up emails.&quot;
                                </p>
                                <div className="flex text-yellow-400">
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="testimonial-card w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                            <div className="bg-neutral-800 p-8 rounded-xl shadow-lg">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                        MP
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-white font-semibold">Maria Patel</h4>
                                        <p className="text-gray-400">UX Designer</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6">
                                    &quot;The insights from JobPouch&apos;s analytics helped me adjust my application strategy. Really impressed with how user-friendly everything is!&quot;
                                </p>
                                <div className="flex text-yellow-400">
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none transform -translate-x-1/2 hidden md:block" id="prevBtn">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none transform translate-x-1/2 hidden md:block" id="nextBtn">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    </section>
    )
}