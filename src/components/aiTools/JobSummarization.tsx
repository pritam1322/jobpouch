'use client';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { trpc } from "@/trpc-client/client";

export default function JobSummarization(){
    const { data: session } = useSession();
    const [jobdescInput, setJobdescInput] = useState('');
    const [summary, setSummary] = useState<{
        keyRequirements?: string[];
        responsibilities?: string[];
        jobOverview?: string;
        keywords?: string[];
        error?: string;
    }>({});

    const aicreads = trpc.createAICreds.useMutation();
    const { data: user } = trpc.getUserByEmail.useQuery(
        { email: session?.user?.email as string },
        { enabled: !!session?.user?.email }
    );
    const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

    const { data: getaiCreds } = trpc.getAICred.useQuery(
        { userId: candidateId ?? 0 },
        { enabled: !!candidateId }
      );

    const handleJobSummarization = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setSummary({}); // Clear previous summary
        if(getaiCreds?.count == 2 && user?.subscriptionPlan === ''){
            toast.error('You have no AI creds left. Update to subscription plan');
            return;
            }
        if(getaiCreds?.count == 5 && user?.subscriptionPlan === 'Essential'){
            toast.error('You have no AI creds left. Update to Premium subscription plan');
            return;
        }
        if(getaiCreds?.count == 10 && user?.subscriptionPlan === 'Premium'){
            toast.error('You have no AI creds left.');
            return;
        }
        if (!jobdescInput.trim()) {
            setSummary({ error: "Please enter a job description." });
            return;
        };

        aicreads.mutateAsync({
            userId: Number(candidateId)
          });

        try {
            const response = await fetch("/api/gemini-setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: jobdescInput }),
            });

            const data = await response.json();
            if (response.ok) {
                setSummary({
                    keyRequirements: data.keyRequirements,
                    responsibilities: data.responsibilities,
                    jobOverview: data.jobOverview,
                    keywords: data.keywords,
                });
            } else {
                toast.error("Failed to fetch job description summary.");
                setSummary({ error: data.message || "Something went wrong." });
            }
        } catch (error) {
            toast.error("Failed to fetch job summary summary"+ error);
            setSummary({ error: "Failed to summarize the job description." });
        }
    };

    return (
        <section>
            <div>
                <span className="flex text-5xl text-gray-300 hover:text-gray-400 duration-100 font-bold justify-center">Job Summarization</span>
            </div>
            
            <div className="flex flex-col gap-2 mx-auto my-12">
                <form onSubmit={handleJobSummarization}>
                    <div className="grid w-full gap-2">
                        <Textarea 
                            placeholder="Add your job description here..." 
                            className="text-white min-h-52 border border-white focus-visible:"
                            onChange={(ev) => setJobdescInput(ev.target.value)}
                        />
                        <Button variant="destructive">Summarize</Button>
                    </div>
                </form>
            </div>

            {summary.error && (
                <div className="mt-4 text-red-500">{summary.error}</div>
            )}

            {!summary.error && summary.keyRequirements && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-100">Summary:</h2>
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Key Requirements:</h3>
                        <ul className="list-disc pl-6">
                            {summary.keyRequirements.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {!summary.error && summary.responsibilities && (
                <div className="mt-8">
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Responsibilities:</h3>
                        <ul className="list-disc pl-6">
                            {summary.responsibilities.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {!summary.error && summary.jobOverview && (
                <div className="mt-8">
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Job Overview:</h3>
                        <p>{summary.jobOverview}</p>
                    </div>
                </div>
            )}
            {!summary.error && summary.keywords && (
                <div className="mt-8">
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Keywords:</h3>
                        <p>{summary.keywords.join(", ")}</p>
                    </div>
                </div>
            )}
        </section>
    )
}