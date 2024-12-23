'use client'

import JobSummarization from "@/components/aiTools/JobSummarization";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function JobSummarizationPage(){
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log(session?.user?.id);
    if (status === "unauthenticated") {
        router.push("/");
      }
    
    return (
        <section className="flex flex-col items-center w-full my-16 text-white">
            <JobSummarization />
        </section>
    )
}