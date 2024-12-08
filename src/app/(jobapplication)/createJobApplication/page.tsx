'use client';
import { trpc } from '@/trpc-client/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export default function CreateJobApplication() {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const { data: session, status } = useSession();
  const createApplication = trpc.createApplication.useMutation();
  const router = useRouter();

  const { data: user } = trpc.getUserByEmail.useQuery(
    { email: session?.user?.email as string }, 
    { enabled: !!session?.user?.email }
  );

  const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

  // Fetch job applications
  const { data: jobs } = trpc.getApplication.useQuery(
    { where: { candidateId: candidateId ?? 0 } },
    { enabled: !!candidateId }
  );
  
  if(status === 'unauthenticated'){
    router.push('/');
  }

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      alert('You must be logged in to create a job application.');
      return;
    }
   
    if(user?.subscriptionPlan === 'Essential' && jobs?.length === 15){
      toast.error('You have reached the maximum number of applications for your subscription plan.');
      return;
    }
    if(user?.subscriptionPlan === 'Premium' && jobs?.length === 30){
      toast.error('You have reached the maximum number of applications for your subscription plan.');
      return;
    }

    const techguid = uuidv4();

    try {
      await createApplication.mutateAsync({
        candidateId: Number(session.user.id),
        companyName,
        jobTitle,
        status: 'Applied',
        appliedDate: new Date().toISOString(),
        referralPerson: referralEmail,
        jobLink,
        techguid,
      });
      toast.success(`Job added to the list of applications`);
      router.push('/viewJobApplication');
    } catch (error) {
      toast.error(error + ' - Error creating application');
    }
  };

  return (
    <div className="min-h-screen mt-12 flex flex-col justify-center items-center">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create New Job Application
        </h1>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2" htmlFor="company">
            Company
          </label>
          <input
            type="text"
            id="company"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-700 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2" htmlFor="position">
            Job Title
          </label>
          <input
            type="text"
            id="position"
            placeholder="Enter job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-700 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2" htmlFor="position">
            Referral&apos;s Email
          </label>
          <input
            type="text"
            id="referralPerson"
            placeholder="Enter email id of the person who referred you"
            value={referralEmail}
            onChange={(e) => setReferralEmail(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-700 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2" htmlFor="position">
            Job Link
          </label>
          <input
            type="text"
            id="jobLink"
            placeholder="Enter job link"
            value={jobLink}
            onChange={(e) => setJobLink(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-700 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full text-lg py-3 mt-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          Submit Application
        </button>
        <div className='flex gap-2 my-2 text-white justify-center'>
          <span className="">Go to existing job applications - </span> 
          <Link href={'/viewJobApplication'} className="text-blue-700 hover:text-blue-500">view applications</Link>
        </div>
      </div>
    </div>
  );
}
