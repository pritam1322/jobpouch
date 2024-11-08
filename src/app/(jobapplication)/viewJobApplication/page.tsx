'use client';
import ViewJobApplicationFilter from "@/components/filters/ViewJobApplicationFeature";
import { trpc } from "@/trpc-client/client";
import { faBriefcase, faCircleUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import React, { useCallback, useState } from "react";

interface JobApplication {
  id: number;
  status: string;
  candidateId: number;
  jobTitle: string;
  companyName: string;
  appliedDate: Date| string;     // Change this to Date
  referralPerson: string | null;
  jobLink: string | null;
}


export default function ViewJobApplication() {
  const { data: session, status } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null); // Track the selected job
  const [newStatus, setNewStatus] = useState(""); // Track the new status
  const router = useRouter();
  
  if(status === 'unauthenticated'){
    router.push('/');
  }

  const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

  // Fetch job applications
  const { data: jobs, isLoading, error, refetch } = trpc.getApplication.useQuery(
    {
      where: {
        candidateId: candidateId ?? 0,
      },
    },
    {
      enabled: !!candidateId,
    }
  );

  // Initialize jobArray safely
  const jobArray = Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];


  // Move useState hook out of dynamic or conditional logic
  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>(jobArray); 
  const handleFilter = useCallback((filteredJobs: JobApplication[]) => {
    setFilteredJobs(filteredJobs);
  }, []);

  // Mutation to update job status
  const updateStatusMutation = trpc.updateApplicationStatus.useMutation({
    onSuccess: () => {
      refetch(); // Refetch jobs after status is updated
      setIsPopupVisible(false); // Close popup after successful update
    },
  });

  if (isLoading) return <p>Loading applications...</p>;
  if (error){
    router.back();
  }
  

  // Handle popup open
  const handleUpdateClick = (job: JobApplication) => {
    setSelectedJob(job); // Set the selected job for updating
    setNewStatus(job.status); // Pre-fill the status with the current job status
    setIsPopupVisible(true); // Show the popup
  };

  // Handle form submission to update status
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJob) {
      await updateStatusMutation.mutateAsync({
        applicationId: selectedJob.id,
        status: newStatus,
      });
      setIsPopupVisible(false); // Close popup after submission
    }
  };

  const activeJobs =  filteredJobs.filter(job => (job.status !== 'Accepted' && job.status !== 'Rejected'));
  
  return (
    <section className="my-4 lg:mx-16 sm:mx-4">
      <div className="flex sm:gap-2 sm:text-xl justify-between p-4 sm:p-2 bg-orange-900   text-white rounded-md shadow-lg">
        <div className="flex gap-3 items-center">
          <FontAwesomeIcon icon={faBriefcase} className="h-8" />
          <h1 className="font-bold text-2xl sm:text-xl ">Applied Jobs</h1>
        </div>

        <nav className="border border-white text-black font-bold hover:text-white p-1 rounded-md bg-white hover:bg-black relative">
          <Link
            href={'/createJobApplication'}
            className=" "
          >
            Add job to track
          </Link>
        </nav>
      </div>

      <div className="mt-3 max-w-60 bg-black text-green-500 px-4 py-2 rounded-lg shadow-lg flex gap-1 items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">Active Jobs</h1>
        
      </div>
      
      <div className="flex gap-2 items-center bg-gray-100 text-green-600 font-bold py-1 px-4 rounded-full shadow-md">
        <FontAwesomeIcon icon={faCircleUp} className="h-4 hover:scale-125" />
        <span>{activeJobs.length}</span>
      </div>
    </div>

    {/* Add filter here */}
    <ViewJobApplicationFilter jobArray={jobArray} onFilter={handleFilter} />

      <div className="grid grid-cols-1 mt-8 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="flex justify-between p-6 shadow-lg rounded-lg bg-black text-white hover:shadow-2xl transition transform duration-300"
          >
            <div>
              <Link
                href={job.jobLink ?? "#"}
                className="font-semibold text-xl mb-2 text-blue-400 hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                {job.jobTitle}
              </Link>
              <p className="text-lg font-medium text-gray-300 mb-1">{job.companyName}</p>
              <p className="text-sm text-gray-400">{new Date(job.appliedDate).toLocaleString()}</p>
              <p className="text-sm text-gray-400">{job.status}</p>
              <p className="text-xs text-gray-400">Referred By - {job.referralPerson}</p>
            </div>
            <button
              onClick={() =>
                handleUpdateClick({
                  ...job,
                  appliedDate: job.appliedDate.toString(),
                })
              }
              className="border  border-white bg-gray-300 text-black items-center p-2 max-h-10 rounded-lg hover:scale-105 transition transform duration-300"
            >
              <span className="font-semibold">Update Status</span>
            </button>
          </div>
        ))}
      </div>

      {isPopupVisible && selectedJob && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsPopupVisible(false)}></div>
          <div className="fixed top-10 left-1/2 w-1/2 h-3/4 transform -translate-x-1/2 bg-white border border-gray-300 rounded shadow-2xl shadow-black/75 z-20 overflow-y-auto pr-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold font-sans m-4">Update Job Status</h2>
              <button onClick={() => setIsPopupVisible(false)} className="rounded-lg p-2 hover:bg-gray-100 mt-3">
                <FontAwesomeIcon icon={faXmark} className="h-5" />
              </button>
            </div>
            <div className="border-t"></div>

            <form onSubmit={handleStatusSubmit}>
              <div className="flex flex-col ml-6 p-2">
                <label htmlFor="status" className="mb-2">
                  Current Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-black rounded mb-4 p-1.5"
                  required
                >
                  <option value="Applied">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="border-t"></div>

              <div className="flex justify-end relative p-4">
                <button type="submit" className="rounded-full bg-blue-700 p-2 px-6">
                  <span className="text-white text-sm">Save</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
