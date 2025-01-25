'use client'
import { trpc } from "@/trpc-client/client";
import { Eye, Star, View, Vote } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function ProjectSection() {
    const { data: session } = useSession();
    const { data: user } = trpc.getUserByEmail.useQuery(
        { email: session?.user?.email as string },
        { enabled: !!session?.user?.email }
    );

    const candidateId = user?.id || null;
    const { data: projects, isLoading, error } = trpc.getProjects.useQuery({ userId: candidateId ?? 0 });

    // Render Tech Stack Labels
    const renderTechStack = (techStack: string) => {
        return techStack.split(',').map((tech, index) => (
            <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-gray-300"
            >
                {tech.trim()}
            </span>
        ));
    };

    if (isLoading) return <div className="text-center text-gray-400">Loading projects...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

    return (
        <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-gray-200 ">Featured Projects</h2>
            <h3 className="text-sm mb-10 text-gray-400">View your projects</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects?.map((project) => (
                    <div key={project.id} className="bg-neutral-900 rounded-lg shadow-lg shadow-white/10 overflow-hidden transition-transform transform hover:scale-[1.02]">
                        
                        {/* Project Thumbnail */}
                        <Link href={project.liveLink ?? "#"} className="block relative h-52">
                            <Image 
                                src={project.thumbnail} 
                                alt={project.title} 
                                width={500} 
                                height={208} 
                                className="object-cover w-full h-full"
                            />
                        </Link>

                        {/* Project Details */}
                        <div className="p-5 ">
                            <div className="flex justify-between">
                                <h3 className="text-xl font-semibold text-gray-100 mb-2">{project.title}</h3>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 items-center mb-2">{renderTechStack(project.techstack)}</div>
                            </div>
                            
                            {/* View Button */}
                            <Button asChild className="w-full border-2 mb-1 mt-2 border-white text-white bg-neutral-900 hover:bg-neutral-900 font-medium py-2 rounded-lg">
                                <Link href={`/viewproject/${project.id}`}><View /> View More</Link>
                            </Button>

                            {/* Stats Section */}
                            <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
                                <button className="flex items-center space-x-1 hover:text-gray-200">
                                    <Vote className="h-4 w-4" />
                                    <span>234</span>
                                </button>

                                <div className="flex space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-400" fill="#FACD14" />
                                        <span>4.5</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Eye className="h-4 w-4" />
                                        <span>1.2k</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
