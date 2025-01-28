
'use client'
import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, SquareArrowOutUpRight, Star, Vote } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {

    const router = useRouter();
    const { status } = useSession();
    

    if(status === 'unauthenticated'){
        router.push('/');
      }

    const { data: project, isLoading, error } = trpc.getProjectById.useQuery({ projectId: params.id });


     // Define color map for tech stack skills
     const techStackColorMap: { [key: string]: string } = {
        'React': 'bg-blue-100 text-blue-800',
        'Node.js': 'bg-green-100 text-green-800',
        'MongoDB': 'bg-yellow-100 text-yellow-800',
        'JavaScript': 'bg-red-100 text-red-800',
        'TypeScript': ' bg-purple-100 text-purple-800',
        'Python': ' bg-blue-100 text-blue-800',
        'AWS': ' bg-orange-100 text-orange-800',
        'Docker': ' bg-gray-100 text-gray-800',
        'Tailwind CSS': 'bg-teal-100 text-teal-800',
        'Next.js': 'bg-indigo-100 text-indigo-800',
        'PostgreSQL': 'bg-amber-100 text-amber-800'
        // Add more tech stacks here as needed
    };

     // Function to render tech stack with color
    const renderTechStack = (techStack: string) => {
        return techStack.split(',').map((tech, index) => {
            const techName = tech.trim();
            const techColorClass = techStackColorMap[techName] || 'bg-gray-400'; // Default to gray if not found
            return (
                <span
                    key={index}
                    className={`${techColorClass} px-3 py-1 bg-blue-100 text-blue-800 rounded-full`}
                >
                    {techName}
                </span>
            );
        });
    };


    if (isLoading) {
    return (
        <section className="bg-neutral-900 text-xl p-8">
        <p>Loading applications...</p>
        </section>
    );
    }

    if (error) {
    router.back();
    }

    return (
        <div className="px-8">
            {project && (
                <section id="projectDetail" className="py-20 bg-neutral-900">
                    {/* Live Project Demo */}
                    {/* <div className="border border-neutral-400 mb-8 max-w-6xl mx-auto">
                        <iframe 
                            src={project.liveLink!}
                            width="100%" 
                            height="450px"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation"
                        >
                        </iframe>
                    </div> */}

                    <div className="mb-8 max-w-7xl">
                        <Image
                            src={project.thumbnail}
                            alt={project.title}
                            width={950}
                            height={700}
                            className="object-cover rounded-lg shadow-lg mx-auto border border-neutral-400"
                        />
                    </div>


                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8 animate__animated animate__fadeIn">
            
                                <div className="bg-neutral-800 rounded-xl shadow-lg p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl font-bold text-neutral-300">{project.title}</h1>
                                        <span className="px-4 py-2 bg-blue-500 text-xs sm:text-sm md:text-base lg:text-md text-white rounded-full">
                                            Score: 92
                                        </span>
                                    </div>
            
                                    {/* <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">React</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Node.js</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">MongoDB</span>
                                    </div> */}

                                    <div className="flex flex-wrap gap-2 items-center mb-2">{renderTechStack(project.techstack)}</div>
            
                                    <p className="text-neutral-300">
                                        {project.description}
                                    </p>
            
                                    <div className="flex flex-wrap gap-4">
                                        <a href={project.githubLink!} target="_blank"
                                            rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                                            <FontAwesomeIcon icon={faGithub} className="w-5 h-5"/>
                                            GitHub Repository
                                        </a>
                                        <a href={project.liveLink!} target="_blank"
                                            rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800">
                                            <SquareArrowOutUpRight className="w-5 h-5"/>
                                            Live Demo
                                        </a>
                                    </div>
            
                                    <div className="flex justify-between items-center gap-8 py-4 border-t border-b">
                                        <button className="upvote-btn flex items-center gap-2 text-neutral-600 hover:text-blue-600">
                                            <Vote className="w-5 h-5 text-neutral-300"/>
                                            <span className="text-neutral-300">234</span>
                                        </button>
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    <Star className="w-5 h-5 text-yellow-500" fill={'#EAB308'}/>
                                                    <span className="ml-1">4.5</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-5 h-5"/>
                                                <span>1.2k</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
            
                                {/* Comments Section */}
                                <div className="bg-neutral-800 rounded-xl shadow-lg p-6 space-y-6">
                                    <h3 className="text-xl font-semibold text-neutral-300">Comments</h3>
                                    <form className="space-y-4">
                                        <textarea className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Leave a comment..."></textarea>
                                        <button type="submit" className="px-6 py-2 text-neutral-300 rounded-lg bg-neutral-700 hover:bg-neutral-900 transition-colors duration-300">Post Comment</button>
                                    </form>
            
                                    <div className="space-y-4">
                                        {/* Comment */}
                                        <div className="border-b pb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-neutral-300">John Doe</h4>
                                                        <span className="text-sm text-neutral-400">2 days ago</span>
                                                    </div>
                                                    <p className="text-neutral-400">Great project! The UI is very intuitive and the performance is excellent.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
            
                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-8 animate__animated animate__fadeInRight">
                                <div className="bg-neutral-800 rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-semibold text-neutral-300 mb-4">Project Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-300">Total Score</span>
                                            <span className="font-semibold">92</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-300">Upvotes</span>
                                            <span className="font-semibold">234</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-300">Stars</span>
                                            <span className="font-semibold">4.5</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-300">Views</span>
                                            <span className="font-semibold">1.2k</span>
                                        </div>
                                    </div>
                                </div>
            
                                <div className="bg-neutral-800 rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-semibold text-neutral-300 mb-4">Created By</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">Jane Smith</h4>
                                            <p className="text-neutral-300 text-sm">Full Stack Developer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                </section>
            )}
        </div>
    );
}
