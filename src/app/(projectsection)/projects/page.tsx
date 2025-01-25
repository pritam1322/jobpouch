"use client";
import ProjectHero from "@/components/projectPages/ProjectHero";
import ProjectSection from "@/components/projectPages/ProjectSection";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc-client/client";
import { CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";



export default function ProjectSectionPage(){

    const router = useRouter();
    const { data: session, status } = useSession();
    const [addProject, setAddProject] = useState(false);
    const addNewProject = trpc.addNewProject.useMutation();
    const [techStack, setTechStack] = useState<string[]>([]);
    const [avatar, setAvatar] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubLink: '',
        liveLink: ''
      });

      if(status === 'unauthenticated'){
        router.push('/');
      }

      const { data: user, isLoading, error } = trpc.getUserByEmail.useQuery(
        { email: session?.user?.email as string }, 
        { enabled: !!session?.user?.email }
      );
    
      const candidateId = user?.id ? user.id : null;
    
      

      const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        
        if(techStack.length == 3 && !techStack.includes(selectedValue)){
            toast.error("You can only select a maximum of 3 technologies");
            return;
        }
        
    
        setTechStack((prev) =>
        prev.includes(selectedValue) ? prev.filter((item) => item !== selectedValue) : [...prev, selectedValue]
        );
 
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleAddNewProject(ev: React.FormEvent){
        ev.preventDefault();
        
        try{
            if(!candidateId){
                toast.error("User ID is not available. Please login and try again");
                return;
            }
            const response = await addNewProject.mutateAsync({
                userId: candidateId!,
                techstack: techStack.join(", "),
                thumbnail: avatar,
                ...formData
            });
            if(response){
                setFormData({
                    title: '',
                    description: '',
                    githubLink: '',
                    liveLink: ''
                });
                setTechStack([]);
                setAddProject(false);
                setAvatar('');
            }
        }catch(err){
            console.error("Error adding new project:", err);
            toast.error("An error occurred while adding your project.");
        }
    }

    async function handleAvatarImageChange(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        const file = ev.target.files?.[0];

        if (file) {
            const data = new FormData;
              data.set('file', file);
              try{
                await fetch('/api/upload', {
                    method: 'POST',
                    body: data,
                  })
                  .then(async(response) => {
                    const data = await response.json();
                    setAvatar(data.url);
                    toast.success("Avatar uploaded successfully.");
                  })
              }catch(error){
                toast.error("An error occurred while uploading your avatar.");
                console.log(error, 'An error occurred while uploading your avatar');
                return;
              }
        }  
    }

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


    return(
        <section className="w-full py-4">

            {/* Project Page */}
            <div className="">
                {/* Dashboard Header */}
                <div className="flex justify-between">                 
                    <div className="flex flex-col text-gray-100">
                        <span className="font-bold lg:text-2xl sm:text-xl">Dashboard Projects</span>
                        <span className="text-sm text-gray-400">Showcase your projects</span>
                    </div>

                    <Button  
                        onClick={() => setAddProject(!addProject)}
                        className="bg-stone-800 hover:bg-stone-700 mt-3 text-gray-200 px-4 py-1 mr-2">
                        <CirclePlus/> Add Project
                    </Button>
                </div>

                {/** Add Project Modal */}
                { addProject && (
                    <div
                        onClick={() => setAddProject(false)} 
                        className="fadeIn fixed inset-0 z-50 bg-neutral-800 bg-opacity-70 transition-opacity dark:bg-opacity-70 ">
                        <div
                            onClick={(e) => e.stopPropagation()} 
                            className="fixed scroll-bar left-1/2 top-0 w-full max-w-[22rem] -translate-x-1/2  rounded-md text-left shadow-xl focus-visible:outline-none sm:align-middle px-8 pt-8 sm:max-w-[35rem] max-h-[95vh] overflow-y-auto bg-neutral-900 z-50">
                            <div className="p-1 w-full rounded-lg shadow-xl">
                                <form onSubmit={handleAddNewProject} className="flex flex-col gap-4">
                                    
                                    <div className="max-w-md pl-2 flex flex-col gap-2">
                                        <div className="my-4">
                                            <h3 data-testid="dialog-title" className="leading-20 text-semibold font-cal text-white pb-1 text-xl" id="modal-title">
                                                Add a new project
                                            </h3>
                                            <p className="text-subtle text-sm">Share your work with the developer community</p>
                                        </div>
                                        <div className="">
                                            <label className="text-white mb-2 block text-sm font-medium leading-none" htmlFor=":r4k:">
                                                Title
                                            </label>
                                            <input id=":r4k:" placeholder="Project Title" onChange={handleChange} className=" border border-gray-500 dark:focus:border-white border-default bg-default placeholder:text-muted text-white
                                                                                                    mb-2 block h-9 rounded-md px-3 py-2 text-sm leading-4 transition w-full" name="title"/>                                  
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="text-white mb-2 block text-sm font-medium leading-none">Description</label>
                                            <textarea id="description" name="description" placeholder="Description Title" onChange={handleChange} rows={4} required className=" dark:focus:border-white border-default bg-default placeholder:text-muted text-white
                                                                                                    mb-2 block h-9 rounded-md border border-gray-500 px-3 py-2 text-sm leading-4 transition w-full min-h-[60px]"></textarea>
                                        </div>

                                        <div>
                                            <label htmlFor="techstack" className="text-white mb-2 block text-sm font-medium leading-none">
                                                Tech Stack
                                            </label>
                                            <div className="mt-1">
                                                <select 
                                                    id="techstack" 
                                                    name="techstack" 
                                                    multiple
                                                    onChange={handleChangeSelect} 
                                                    className="mt-1 block w-full rounded-md border border-gray-500 bg-neutral-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                >
                                                    <option value="React" className="bg-neutral-900 text-neutral-400">React</option>
                                                    <option value="Vue" className="bg-neutral-900 text-neutral-400">Vue</option>
                                                    <option value="Angular" className="bg-neutral-900 text-neutral-400">Angular</option>
                                                    <option value="Node.js" className="bg-neutral-900 text-neutral-400">Node.js</option>
                                                    <option value="Python" className="bg-neutral-900 text-neutral-400">Python</option>
                                                    <option value="Java" className="bg-neutral-900 text-neutral-400">Java</option>
                                                    <option value="MongoDB" className="bg-neutral-900 text-neutral-400">MongoDB</option>
                                                    <option value="PostgreSQL" className="bg-neutral-900 text-neutral-400">PostgreSQL</option>
                                                </select>
                                            </div>
                                            {/* Selected Tech Stack Badges */}
                                            <div id="selectedTechStack" className="flex flex-wrap gap-2 mt-2">
                                                {techStack.map((tech, index) => (
                                                <span key={index} className="px-3 py-1 bg-neutral-800 text-white rounded-full text-sm">
                                                    {tech}
                                                </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="githubLink" className="text-white mb-2 block text-sm font-medium leading-none">GitHub Link</label>
                                                <input type="url" id="githubLink" name="githubLink" onChange={handleChange} required className=" dark:focus:border-white border-default bg-default placeholder:text-muted text-white
                                                                                                    mb-2 block h-9 rounded-md border border-gray-500 px-3 py-2 text-sm leading-4 transition w-full"/>
                                            </div>

                                            <div>
                                                <label htmlFor="liveLink" className="text-white mb-2 block text-sm font-medium leading-none">Live Demo Link</label>
                                                <input type="url" id="liveLink" name="liveLink" onChange={handleChange} className=" dark:focus:border-white border-default bg-default placeholder:text-muted text-white
                                                                                                    mb-2 block h-9 rounded-md border border-gray-500 px-3 py-2 text-sm leading-4 transition w-full"/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Image Upload */}                               
                                    <label htmlFor="avatarIn" className="block text-sm font-medium text-neutral-300">Project Thumbnail</label>
                                    <div className=" flex justify-center px-6 pt-2 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            <div className="flex text-sm text-neutral-600">
                                                <label htmlFor="thumbnail" className="relative cursor-pointe rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>Upload a file</span>
                                                    <input  type="file" className="sr-only" id="thumbnail" accept="image/*" required onChange={handleAvatarImageChange}/>
                                                    <input type='hidden' name="thumbnail"/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="bottom-0 sticky bg-neutral-900 w-full h-20">
                                        <h1 data-testid="divider" className="border border-gray-300 -mx-8" />
                                        <div className="flex justify-end ">
                                            <Button  
                                                onClick={() => setAddProject(!addProject)}
                                                className="bg-neutral-900 items-center hover:bg-stone-800 mt-3 text-gray-100 px-4 py-1 mr-2">
                                                Close
                                            </Button>
                                            <Button  
                                                type="submit"
                                                className="bg-gray-200 hover:bg-gray-300 mt-3 text-black px-4 py-1 mr-2">
                                                Continue
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                    </div>                  
                )}


                {/* Project Hero */}
                <ProjectHero setAddProject={setAddProject} />
            </div>
                    
            {/* Project Section */}
            <ProjectSection /> 


            

        </section>
    )
}