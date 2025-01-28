'use client';
import { trpc } from "@/trpc-client/client";
import { prisma } from "@/trpc-server/prisma";
import { Filter, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface EmailInterface {
    id: string;
    snippet: string;
    onAddJobTrack: (snippet: string, id: string) => void;
    onDeleleEmail: (id: string) => void;
}

export default function ViewEmailSection(){

    const { data: session } = useSession();
    const [ emailData, setEmailData ] = useState<EmailInterface[]>([])

    
    const { data: user } = trpc.getUserByEmail.useQuery(
        { email: session?.user?.email as string }, 
        { enabled: !!session?.user?.email }
      );
    
    const candidateId = user?.id ? user.id : null;

    const { data: emails, refetch  } = trpc.getEmailFetched.useQuery(
        { userId: candidateId! }, 
        { enabled: !!candidateId }
      );
    
    const deleteEmailMutation = trpc.deleteEmail.useMutation();

      useEffect(() => {
        if (emails) {
          // Transform emails data to match EmailInterface shape
          const transformedEmails = emails.map((email) => ({
            id: email.id, // Store id as unique identifier
            snippet: email.snippet, // Store snippet as body
            onAddJobTrack: () => handleEmailToJob(email.snippet, email.id),
            onDeleleEmail: () => handleEmailDelete(email.id),
          }));
          
          setEmailData((prev) => 
            JSON.stringify(prev) !== JSON.stringify(transformedEmails) ? transformedEmails : prev
    );
        }
      }, [emails]);
    
      const handleEmailDelete = async(id: string) => {
        try{
            if(!id){
                toast.error('No email id provided');
                return;
            }
             await deleteEmailMutation.mutateAsync({
                id: id,
            })

            toast.success('Email deleted');
            refetch();

        }catch(err){
            toast.error('Failed to delete email');
            console.log(err);
        }
      }

      const handleEmailToJob = async(snippet: string, id: string) => {
        try{
            const response = await fetch("/api/emailParsing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailbody: snippet, emailId: id }),
                });
            
            if(response.ok){
                toast.success('Job added to tracking');
                refetch();
            }
        }catch(err){
            toast.error('Failed to parse email');
            console.log(err);
        }
      };

    return(
        <section id="emailList" className="min-h-screen p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-300">Job Application Emails</h1>
                <p className="text-neutral-500">View and manage your job application responses</p>
            </div>

            
            <div className="mt-8">
                <DataTable columns={columns} data={emailData} />
            </div>
        </section>
    )
}