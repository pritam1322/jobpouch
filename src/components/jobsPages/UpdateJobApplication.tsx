import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { trpc } from "@/trpc-client/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface JobApplication {
  id: number;
  status: string;
  candidateId: number;
  jobTitle: string;
  companyName: string;
  appliedDate: Date;
  referralPerson: string | null;
  jobLink: string | null;
}

interface StatusPopupProps {
  selectedJob: JobApplication | null;
  onClose: () => void;
  onSubmit: () => void;
}

const UpdateJobApplication: React.FC<StatusPopupProps> = ({ selectedJob, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    referralPersonName: '',
    referralPerson: '',
    status: 'Applied',
    salaryRange: '',
  });

  const { status } = useSession();
  const router = useRouter();

  if(status === 'unauthenticated') {
    router.push('/');
  }

  const updateApplication = trpc.updateJobApplication.useMutation();

  // Fetch job application details using selectedJob.id
  const { data: job } = trpc.getSingleApplication.useQuery(
    { applicationId: selectedJob?.id ?? 0 },
    { enabled: !!selectedJob?.id }
  );

  useEffect(() => {
    if (job) {
      setFormData({
        jobTitle: job.jobTitle || "",
        companyName: job.companyName || "",
        referralPerson: job.referralPerson || "",
        jobLink: job.jobLink || "",
        status: job.status || "Applied",
        salaryRange: job.salaryRange || "",
        referralPersonName: job.referralPersonName || "" // Add other fields with default empty values
      });
    }
  }, [job]); // Trigger when job data is fetched/updated

  const handleJobApplicationUpdate = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!selectedJob) return;

    try {
      // Update job application with new data

      await updateApplication.mutateAsync({
        id: selectedJob.id,
        ...formData,
      });
      toast.success('Application updated successfully');
      onSubmit();
      onClose(); // Close the modal on successful update
    } catch (err) {
      console.error("Failed to update job application", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section>
      {/* Sync Email Settings */}
      {selectedJob && (
        <div
          onClick={onClose}
          className="fadeIn fixed inset-0 z-50 bg-neutral-800 bg-opacity-70 transition-opacity dark:bg-opacity-70"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed scroll-bar left-1/2 top-[30px] w-full max-w-[22rem] -translate-x-1/2 rounded-md text-left sm:align-middle px-8 pt-8 sm:max-w-[35rem] max-h-[95vh] overflow-y-auto z-50"
          >
            <Card>
              <CardHeader>
                <CardTitle>Update Job Application</CardTitle>
                <CardDescription>Customize your job application</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobApplicationUpdate}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="referralPerson">Referred By</Label>
                      <Input
                        id="referralPerson"
                        name="referralPerson"
                        value={formData.referralPerson || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="jobLink">Job Link</Label>
                      <Input
                        id="jobLink"
                        name="jobLink"
                        value={formData.jobLink || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Application Status</label>
                        <select 
                          id="status" 
                          name="status" 
                          onChange={handleChange} 
                          value={formData.status || ""}
                          className="w-full px-4 py-1 bg-transparent border border-gray-600 rounded-md text-gray-100 "
                        >
                          <option className='bg-gray-200'>Applied</option>
                          <option className='bg-gray-200'>Accepted</option>
                          <option className='bg-gray-200'>Rejected</option>
                          <option className='bg-gray-200'>Interview</option>
                          <option className='bg-gray-200'>Offer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <CardFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpdateJobApplication;
