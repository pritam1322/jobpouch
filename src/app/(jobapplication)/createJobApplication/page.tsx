'use client';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc-client/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export default function CreateJobApplication() {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    referralPersonName: '',
    referralPerson: '',
    appliedDate: '',
    status: 'Applied',
    recruiterName: '',
    salaryRange: '',
    followupDate: '',
  });
  const { data: session, status } = useSession();
  const createApplication = trpc.createApplication.useMutation();
  const router = useRouter();
  
  console.log(session?.user?.email);
  const { data: user } = trpc.getUserByEmail.useQuery(
    { email: session?.user?.email as string }, 
    { enabled: !!session?.user?.email }
  );

  const candidateId = user?.id ? user.id : null;


  // Fetch job applications
  const { data: jobs } = trpc.getApplication.useQuery(
    { where: { candidateId: candidateId ?? 0 } },
    { enabled: !!candidateId }
  );
  
  if(status === 'unauthenticated'){
    router.push('/');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!candidateId) {
      alert('You must be logged in to create a job application.');
      return;
    }
    if ((
        user?.subscriptionPlan == null ||
        user?.subscriptionPlan === 'Essential' && user?.subscriptionStatus !== 'completed' ||
        user?.subscriptionPlan === 'Premium' && user?.subscriptionStatus !== 'completed'
      ) && (jobs?.length ?? 0) >= 5) {
      toast.error('You have reached the maximum number of applications for your subscription plan.');
      return;
    }
    
    if (user?.subscriptionPlan === 'Essential' && user?.subscriptionStatus === 'completed' && (jobs?.length ?? 0) >= 15) {
      toast.error('You have reached the maximum number of applications for your subscription plan.');
      return;
    }
    
    if (user?.subscriptionPlan === 'Premium' && user?.subscriptionStatus === 'completed' && (jobs?.length ?? 0) >= 30) {
      toast.error('You have reached the maximum number of applications for your subscription plan.');
      return;
    }

    const techguid = uuidv4();

    try {
      await createApplication.mutateAsync({
        candidateId: candidateId,
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),  // Ensure valid datetime
        followupDate: new Date(formData.followupDate).toISOString(),
        techguid,
      });
      toast.success(`Job added to the list of applications`);
      router.push('/viewJobApplication');
    } catch (error) {
      toast.error(error + ' - Error creating application');
      console.log('@@@@@@' + error);
    }
  };

  return (
    <section id="addJob" className="min-w-full my-2 mx-auto">
      <div className=" bg-neutral-900 rounded  p-6">
          <h2 className="text-2xl text-neutral-200 font-bold">Add Job Application</h2>
          <h3 className="text-sm text-neutral-400 mb-12">Track your job applications</h3>
          <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-800 w-full border border-gray-700 p-6 rounded-lg">
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                    <input type="text" id="jobTitle" name="jobTitle" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Senior Frontend Developer"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input type="text" id="companyName" name="companyName" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Google"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Application Date</label>
                    <input type="date" id="appliedDate" name="appliedDate" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Application Status</label>
                    <select id="status" name="status" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option className='bg-gray-200'>Applied</option>
                      <option className='bg-gray-200'>Accepted</option>
                      <option className='bg-gray-200'>Rejected</option>
                      <option className='bg-gray-200'>Interview</option>
                      <option className='bg-gray-200'>Offer</option>
                      
                    </select>
                  </div>
                </div>

                {/* Recruiter Information */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recruiter Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Recruiter Name</label>
                      <input type="text" id="referralPersonName" name="referralPersonName" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Smith"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Recruiter Email</label>
                      <input type="email" id="referralPerson" name="referralPerson" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. john@company.com"/>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Job Posting URL</label>
                      <input type="url" id="jobLink" name="jobLink" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Salary Range</label>
                      <input type="text" id="salaryRange" name="salaryRange" onChange={handleChange} className="w-full px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. $80,000 - $100,000"/>
                    </div>
                  </div>
                </div>

                {/* Follow-up Reminder */}
                <div className="border-t border-gray-600 pt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Set Follow-up Reminder</label>
                  <div className="flex items-center space-x-4">
                    <input type="date" id="followupDate" name="followupDate" onChange={handleChange} className="flex-1 px-4 py-2 w-1/2 bg-neutral-700 border border-gray-600 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    {/* <input type="time" id="position" className="w-32 px-4 py-2 bg-neutral-700 border border-gray-600 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/> */}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center ">
                    <Button type="submit" variant="destructive" className="w-1/3">Save</Button>
                </div>
              </form>
            </div>
      </div>
  </section>
  );
}
