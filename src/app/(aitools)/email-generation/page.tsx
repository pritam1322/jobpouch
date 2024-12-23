"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";

export default function LLMEmailDM() {
  const { data: session } = useSession();
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [linkedinDMContent, setLinkedinDMContent] = useState("");
  const [error, setError] = useState("");

  const saveTemplate = trpc.createTemplates.useMutation();
  const aicreads = trpc.createAICreds.useMutation();
  const { data: user } = trpc.getUserByEmail.useQuery(
    { email: session?.user?.email as string },
    { enabled: !!session?.user?.email }
  );

  const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

  const { data: template } = trpc.getEmailTemplate.useQuery(
    { userId: candidateId ?? 0 },
    { enabled: !!candidateId }
  );

  const { data: getaiCreds } = trpc.getAICred.useQuery(
    { userId: candidateId ?? 0 },
    { enabled: !!candidateId }
  );

  useEffect(() => {
    if (template) {
      setEmailContent(template.emailtemplate);
      setLinkedinDMContent(template.linkedintemplate);
    }
  }, [template]);


  const handleGenerateMessage = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEmailContent(""); // Clear previous email content
    setLinkedinDMContent(""); 
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
      
    // Clear previous LinkedIn DM content
    aicreads.mutateAsync({
      userId: Number(candidateId)
    });

    if (!jobRole || !companyName || !personalMessage) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("/api/huggingface-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobRole,
          companyName,
          personalMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the generated template
        await saveTemplate.mutateAsync({
          name: `template-${user?.name || "default"}`,
          emailtemplate: data.emailContent,
          linkedintemplate: data.linkedinDMContent,
          userId: Number(candidateId),
        });

        // Update state with the generated content
        setEmailContent(data.emailContent);
        setLinkedinDMContent(data.linkedinDMContent);
      } else {
        toast.error("Failed to generate message.");
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error occurred while generating message." , error);
      setError("Failed to generate message.");
    }
  };

  return (
    <section className="flex flex-col items-center w-full my-8 text-white">
      <h2 className="text-2xl font-bold">LLM Email/DM Generator</h2>
      <form onSubmit={handleGenerateMessage} className="w-full max-w-md space-y-4 mt-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="jobRole">Job Role</label>
          <input
            type="text"
            id="jobRole"
            className="p-2 rounded-md bg-neutral-700 text-white"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="Enter the job role you're interested in"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            className="p-2 rounded-md bg-neutral-700 text-white"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter the company name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="personalMessage">Personal Message</label>
          <Textarea
            id="personalMessage"
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            placeholder="Add any personal message you want to include"
            className="min-h-40 p-2 rounded-md bg-neutral-700 text-white"
          />
        </div>

        <Button variant="destructive" className="w-full">Generate Message</Button>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {emailContent && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">Generated Email:</h3>
          <Textarea
            className="min-h-72 w-[700px] p-2 rounded-md bg-neutral-700 text-white"
            value={emailContent}
            readOnly
          />
        </div>
      )}

      {linkedinDMContent && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">Generated LinkedIn DM:</h3>
          <Textarea
            className="min-h-72 w-[700px] p-2 rounded-md bg-neutral-700 text-white"
            value={linkedinDMContent}
            readOnly
          />
        </div>
      )}
    </section>
  );
}
