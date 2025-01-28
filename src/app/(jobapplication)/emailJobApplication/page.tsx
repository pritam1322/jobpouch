'use client';
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc-client/client";
import { CircleCheck, Clock5, Mail, MailPlus, Settings, Upload } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import ViewEmailSection from "@/components/emailPages/ViewEmailSection";
import toast from "react-hot-toast";

const ConnectGmailButton = () => {
  const { data: session } = useSession();
  const [ showSignInWithGoogle, setShowSignInWithGoogle ] = useState(false);
  const [ syncEmailSetting, setSyncEmailSetting ] = useState(false);
  const [ subject, setSubject ] = useState('');
  const [ maxNoOfEmail, setMaxNoOfEmail ] = useState('');

  const { data: user } = trpc.getUserByEmail.useQuery(
    { email: session?.user?.email as string }, 
    { enabled: !!session?.user?.email }
  );

  const candidateId = user?.id ? user.id : null;

  // Fetch job applications
  const { data: account } = trpc.getAccountFromUserId.useQuery(
    { userId: candidateId ?? 0 }, 
    { enabled: Boolean(candidateId) }
  );


  useEffect(() => {
    if(account && account.access_token){
        setShowSignInWithGoogle(true);
      }
  }, [account])

  const handleClick = () => {
    if (!session) {
      // If the user is not logged in, redirect to sign in page
      signIn("google"); // Trigger the Google sign-in flow
    } else {
      // User is logged in, initiate Gmail connection flow
      signIn("google", { callbackUrl: "/emailJobApplication" }); // Redirect to the callback URL after Google sign-in
    }
  };

    const fetchEmails = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
    
    
        if (user?.gmailAccessToken) {
            const accessToken = user?.gmailAccessToken;
            const refreshToken = user?.gmailRefreshToken;
            if (!subject || !maxNoOfEmail) {
                console.warn("Missing required fields");
                return;
            }
            
            try {
                const response = await fetch("/api/fetchAndDisplayEmailsBySubject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken, subject,  maxNoOfEmail, refreshToken }),
                });
        
                if(response.ok){
                    toast.success('Emails synced');
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        }
    };
  

  return (
    <section id="dashboard" className="min-h-screen p-6 w-full">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-300">Email Dashboard</h1>
            <p className="text-neutral-500">Connect and manage your job application emails</p>
        </div>

        {/* Gmail Connection Status */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-950 p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <Mail className="w-8 h-8 text-red-500" />
                    <div>
                        <h2 className="text-lg text-neutral-300 font-semibold">Gmail Connection</h2>
                        <p className="text-sm text-neutral-500">Connect your Gmail account to start fetching emails</p>
                    </div>
                </div>                   
                    <button id="connectGmail" onClick={handleClick} disabled={showSignInWithGoogle} className="flex items-center gap-2 px-6 py-2 bg-neutral-900 border border-neutral-950 rounded-lg hover:bg-neutral-950 transition-colors disabled:bg-neutral-800">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Sign in with Google
                    </button>
                {/* {!showSignInWithGoogle && (
                        <button id="connectGmail" onClick={handleClick} className="flex items-center gap-2 px-6 py-2 bg-neutral-900 border border-neutral-950 rounded-lg hover:bg-neutral-950 transition-colors ">
                            
                            
                        </button>
                )} */}
            </div>
        </div>

        {/* Email Fetch Controls */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-950 p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-300">Fetch Job Application Emails</h2>
                    <p className="text-sm text-neutral-500">Get the latest 10 job application responses</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <div onClick={() => setSyncEmailSetting(true)} className="bg-neutral-900 p-2 rounded-md hover:bg-neutral-950">
                        <Settings className="h-5 w-5" />
                    </div>
                    <button id="fetchEmails" onClick={fetchEmails} className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-950">
                        <Upload className="h-5 w-5" />
                        Sync Emails
                    </button>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-stone-800 rounded-lg  p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <MailPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-300">Total Emails</p>
                        <p className="text-2xl font-semibold">0</p>
                    </div>
                </div>
            </div>

            <div className="bg-stone-800 rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <CircleCheck className="w-6 h-6 text-green-600"  />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-300">Saved in Database</p>
                        <p className="text-2xl font-semibold">0</p>
                    </div>
                </div>
            </div>

            <div className="bg-stone-800 rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                        <Clock5 className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-300">Pending Sync</p>
                        <p className="text-2xl font-semibold">0</p>
                    </div>
                </div>
            </div>
        </div>

      {/* Loading State (Hidden by default) */}
        <div id="loadingState" className="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
            <div className="bg-white p-6 rounded-lg flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-lg">Fetching emails...</p>
            </div>
        </div>

        {/* Sync Email Settings */}
        { syncEmailSetting && (
            <div
                onClick={() => setSyncEmailSetting(false)} 
                className="fadeIn fixed inset-0 z-50 bg-neutral-800 bg-opacity-70 transition-opacity dark:bg-opacity-70 ">
                <div
                    onClick={(e) => e.stopPropagation()} 
                    className="fixed scroll-bar left-1/2 top-[30px] w-full max-w-[22rem] -translate-x-1/2  rounded-md text-left sm:align-middle px-8 pt-8 sm:max-w-[35rem] max-h-[95vh] overflow-y-auto z-50">
                        <Card className="">
                            <CardHeader>
                                <CardTitle>Email Search Criteria</CardTitle>
                                <CardDescription>Customize your email fetching preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" onChange={(ev) => setSubject(ev.target.value)} placeholder="Thank you for applying" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="max_no_of_email">Maximum Emails to be Synced</Label>
                                    <Select onValueChange={setMaxNoOfEmail}>
                                        <SelectTrigger id="max_no_of_email">
                                        <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                        <SelectItem value="5">5 emails</SelectItem>
                                        <SelectItem value="10">10 emails</SelectItem>
                                        <SelectItem value="15">15 emails</SelectItem>
                                        <SelectItem value="20">20 emails</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>
                                </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setSyncEmailSetting(false)}>Cancel</Button>
                                <Button type="submit" onClick={() => setSyncEmailSetting(false)}>Save</Button>
                            </CardFooter>
                        </Card>
                    
                    </div>
                </div>
            )}
        
            <ViewEmailSection />
  </section>
  );
};

export default ConnectGmailButton;
