

interface ProjectHeroProps {
    setAddProject: (open: boolean) => void; // Define the function type
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ setAddProject }) => {
    return (
        <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-13 items-center justify-between bg-neutral-600 p-6 rounded-lg gap-4 my-6 max-w-6xl mr-3 min-h-[70hv]">
                {/* Left Section */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Showcase Your <span className="text-blue-500">Projects</span> Build Your Portfolio</h1>
                    <p className="text-sm text-neutral-300">
                        Create, share, and discover amazing projects.<br/> Get recognition for your work and connect with other developers.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <a onClick={() => setAddProject(true)} className="bg-neutral-800 hover:bg-neutral-700 max-w-md px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                            Add Project
                        </a>
                        <a href="#projectGrid" className="bg-neutral-800 hover:bg-neutral-700 max-w-md px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                            Browse Projects
                        </a>
                    </div>
                </div>

                {/* Right Section */}
                <div className="bg-neutral-800 rounded-xl relative">
                    <div className="relative">
                        <div className="aspect-w-16 aspect-h-9 bg-neutral-700"></div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Score: 98</span>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mt-6 mb-4">
                            <h3 className="text-xl font-semibold">AI Image Generator</h3>
                            <div className="flex items-center">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="ml-1">4.9</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-neutral-700 rounded-full text-sm">Python</span>
                            <span className="px-3 py-1 bg-neutral-700 rounded-full text-sm">TensorFlow</span>
                            <span className="px-3 py-1 bg-neutral-700 rounded-full text-sm">React</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400 text-sm">
                            <div className="flex items-center space-x-4">
                                <button className="trending-upvote-btn flex items-center space-x-1 hover:text-blue-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                    <span>428</span>
                                </button>
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    <span>2.3k</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    )
}

export default ProjectHero;