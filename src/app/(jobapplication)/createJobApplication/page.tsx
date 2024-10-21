'use client';
import { trpc } from '@/trpc-client/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function CreateJobApplication() {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const { data: session, status } = useSession();
  const createApplication = trpc.createApplication.useMutation();

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      alert('You must be logged in to create a job application.');
      return;
    }
    try {
      await createApplication.mutate({
        candidateId: Number(session.user.id),
        companyName,
        jobTitle,
        status: 'Applied',
        appliedDate: new Date().toISOString(),
      });
      alert('Application Created!');
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-black p-8 rounded-lg shadow-md max-w-lg w-full">
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
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-100 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-100 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full text-lg py-3 mt-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
