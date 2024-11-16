'use client';

import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StatsJobCount(){

    const session = useSession();
    const router = useRouter();
    const candidateId = session?.data?.user?.id

    const { data: jobs, isLoading, error } = trpc.getApplication.useQuery(
        { where: { candidateId: Number(candidateId) ?? 0 } },
        { enabled: !!candidateId }
      );
    
    if(!jobs){
        return (
            <section className="bg-neutral-800 text-xl p-8">
            <p>No applications found.</p>
            </section>
        );
    }

    const activeJobs = jobs.filter((job) => job.status !== "Accepted" && job.status !== "Rejected");
    const probabilty  = ((jobs.length - activeJobs.length) *  100 )/jobs.length;
    if (isLoading) {
    return (
        <section className="bg-neutral-800 text-xl p-8">
        <p>Loading applications...</p>
        </section>
    );
    }
    
    if (error) {
    router.push('/');
    }

    return (
        <section>
            <div className="stats shadow flex max-w-4xl mx-auto p-4 bg-btncolor text-gray-500">
                <div className="stat">
                    <div className="stat-figure ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    </div>
                    <div className="stat-title text-gray-500">Total Job Applied</div>
                    <div className="stat-value text-pink-500">{jobs?.length}</div>
                    <div className="stat-desc text-gray-500">21% more than last month</div>
                </div>

                <div className="stat">
                    <div className="stat-figure">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    </div>
                    <div className="stat-title text-gray-500">Active Jobs</div>
                    <div className="stat-value text-green-500">{activeJobs.length}</div>
                    <div className="stat-desc text-gray-500">21% more than last month</div>
                </div>

                <div className="stat">
                    <div className="stat-title text-gray-500">Interview stage</div>
                    <div className="stat-value text-yellow-400">{probabilty}%</div>
                    <div className="stat-desc text-gray-500">interview converting probabilty</div>
                </div>
                </div>
        </section>
    )
}