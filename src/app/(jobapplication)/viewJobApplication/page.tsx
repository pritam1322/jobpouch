"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "@/trpc-client/client";
import StatusPopup from "@/components/ViewJobComponents/StatusPopup";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Calendar, CircleCheck, CircleX, Gift } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

interface JobApplication {
  id: number;
  status: string;
  candidateId: number;
  jobTitle: string;
  companyName: string;
  appliedDate: Date; // Properly typed as Date
  referralPerson: string | null;
  jobLink: string | null;
  onStatusUpdate?: (job: JobApplication) => void;
  onDeleteJob?: (job: JobApplication) => void;
}

export default function ViewJobApplication() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [newStatus, setNewStatus] = useState(""); 
  const [jobToDelete, setJobToDelete] = useState<JobApplication | null>(null);
  
  if (status === "unauthenticated") {
    router.push("/");
  }
  
  const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

  // Fetch job applications
  const { data: jobs, isLoading, error, refetch } = trpc.getApplication.useQuery(
    { where: { candidateId: candidateId ?? 0 } },
    { enabled: !!candidateId }
  );

  const deleteJobMutation = trpc.deleteApplication.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Ensure jobs is an array
  const jobArray = Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];

  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>([]);

  // Transform jobs into the required format
  useEffect(() => {
    const transformedJobs: JobApplication[] = jobArray.map((job) => ({
      id: job.id,
      status: job.status,
      candidateId: job.candidateId,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      appliedDate: job.appliedDate, // Ensure Date object
      referralPerson: job.referralPerson ?? null, // Default to null
      jobLink: job.jobLink ?? null, // Default to null
      onStatusUpdate: () => handleUpdateClick(job),
      onDeleteJob: () => handleDeleteClick(job)
    }));
    setFilteredJobs(transformedJobs);
  }, [jobs]);

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

  const handleDeleteClick = (job: JobApplication) => {
    setJobToDelete(job);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      await deleteJobMutation.mutateAsync({ applicationId: jobToDelete.id });
      setJobToDelete(null);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJob) {
      await updateStatusMutation.mutateAsync({ applicationId: selectedJob.id, status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-neutral-900 text-xl p-8">
        <p>Loading applications...</p>
      </section>
    );
  }

  if (error) {
    router.back();
  }

  return (
    <section className="w-full relative px-6 py-4 mb-20 max-w-9xl lg:mx-auto sm:mx-4">

      {/* Top Heading Layer */}
      <div className=" flex items-center mb-6">
        <div className="flex space-x-4 items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="ml-4 bg-neutral-700 rounded-full px-4 py-1 text-sm text-gray-300">app.jobpouch.com</div>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="flex flex-col text-gray-100">
          <span className="font-bold lg:text-2xl sm:text-xl">Dashboard</span>
          <span className="text-sm text-gray-400">View your job applications</span>
      </div>

      {/* Application stages count */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded border bg-stone-800">
              <div className="flex items-center justify-between">
                  <h3 className="text-gray-100">Total Applications</h3>
                  <span className=" rounded-full hover:text-green-600">
                      <CircleCheck className="w-5 h-5" />
                  </span>
              </div>
              <p className="text-2xl font-bold mt-2">{jobs?.length}</p>
          </div>
          <div className="bg-stone-800 p-4 rounded border">
              <div className="flex items-center justify-between">
                  <h3 className="text-gray-100">Interviews</h3>
                  <span className="p-2 rounded-full">
                      <Calendar className="w-5 h-5" />
                  </span>
              </div>
              <p className="text-2xl font-bold mt-2">{jobs?.filter((job) => job.status === "Interview" ).length}</p>
          </div>
          <div className=" p-4 rounded border bg-stone-800">
              <div className="flex items-center justify-between">
                  <h3 className="text-gray-100">Offers</h3>
                  <span className="p-2 rounded-full">
                      <Gift className="w-5 h-5" />
                  </span>
              </div>
              <p className="text-2xl font-bold mt-2">{jobs?.filter((job) => job.status === "Offer" ).length}</p>
          </div>
          <div className="bg-stone-800 p-4 rounded border ">
              <div className="flex items-center justify-between">
                  <h3 className="text-gray-100">Rejected</h3>
                  <span className="p-2 rounded-full ">
                      <CircleX className="w-5 h-5" />
                  </span>
              </div>
              <p className="text-2xl font-bold mt-2">{jobs?.filter((job) => job.status === "Rejected" ).length}</p>
          </div>
        </div>
      </div>


      {/* Delete Alert box */}
      {jobToDelete && (
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setJobToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}

      {/* Job Applications Table */}
      <DataTable data={filteredJobs} columns={columns} />

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
