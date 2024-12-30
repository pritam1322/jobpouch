'use client';
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "@/trpc-client/client";

import ViewJobApplicationFilter from "@/components/filters/ViewJobApplicationFeature";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import JobApplicationTable from "@/components/ViewJobComponents/JobApplicationTable";
import StatusPopup from "@/components/ViewJobComponents/StatusPopup";

interface JobApplication {
  id: number;
  status: string;
  candidateId: number;
  jobTitle: string;
  companyName: string;
  appliedDate: Date; // Properly typed as Date
  referralPerson: string | null;
  jobLink: string | null;
}

export default function ViewJobApplication() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [newStatus, setNewStatus] = useState("");
  
  if (status === "unauthenticated") {
    router.push("/");
  }
  
  const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

  // Fetch job applications
  const { data: jobs, isLoading, error, refetch } = trpc.getApplication.useQuery(
    { where: { candidateId: candidateId ?? 0 } },
    { enabled: !!candidateId }
  );

  const jobArray = Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];
  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>(jobArray);
  
  const handleFilter = useCallback((filteredJobs: JobApplication[]) => {
    setFilteredJobs(filteredJobs);
  }, []);

  const updateStatusMutation = trpc.updateApplicationStatus.useMutation({
    onSuccess: () => {
      refetch();
      setIsPopupVisible(false);
    },
  });

  const handleUpdateClick = (job: JobApplication) => {
    setSelectedJob(job);
    setNewStatus(job.status);
    setIsPopupVisible(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJob) {
      await updateStatusMutation.mutateAsync({ applicationId: selectedJob.id, status: newStatus });
    }
  };

  const activeJobs = filteredJobs.filter((job) => job.status !== "Accepted" && job.status !== "Rejected");

  if (isLoading) {
    return (
      <section className="bg-neutral-800 text-xl p-8">
        <p>Loading applications...</p>
      </section>
    );
  }

  if (error) {
    router.back();
  }

  return (
    <section className="mt-4 mb-20 lg:mx-auto sm:mx-4">
      <button className="btn btn-warning">
        Active Jobs
        <div className="badge p-3"><FontAwesomeIcon icon={faCircleUp} className="h-4 pr-1" />{activeJobs.length}</div>
      </button>

      <div className="flex justify-between p-2">
        <div className="flex flex-col text-gray-100">
          <div>
            <span className="font-bold lg:text-3xl sm:text-xl ">Applied Jobs</span>
            <label className="swap swap-flip text-3xl -rotate-12">
              <input type="checkbox" />

              <div className="swap-on">😈</div>
              <div className="swap-off">🥳</div>
            </label>
          </div>
          <span className="text-sm text-gray-400">View your jobs application</span>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-neutral indicator bg-btncolor border-btncolor hover:bg-neutal-900 text-gray-200" onClick={() => router.push("/createJobApplication")}>
            <span className="px-6">Add Jobs</span>
          </button>
        </div>
      </div>
      
      <ViewJobApplicationFilter jobArray={jobArray} onFilter={handleFilter} />
      <JobApplicationTable jobs={filteredJobs} onStatusUpdate={handleUpdateClick} />

      {isPopupVisible && selectedJob && (
        <StatusPopup
          selectedJob={selectedJob}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          onClose={() => setIsPopupVisible(false)}
          onSubmit={handleStatusSubmit}
        />
      )}
    </section>
  );
}
