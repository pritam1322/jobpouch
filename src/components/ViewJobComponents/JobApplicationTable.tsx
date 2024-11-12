// JobApplicationTable.tsx
import React from "react";
import Link from "next/link";

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


interface JobApplicationTableProps {
  jobs: JobApplication[];
  onStatusUpdate: (job: JobApplication) => void;
}

const JobApplicationTable: React.FC<JobApplicationTableProps> = ({ jobs, onStatusUpdate }) => (
  <div className="my-16 text-gray-400 ">
    <table className="table w-full">
      <thead>
        <tr className="text-gray-400">
          <th>
            <label></label>
          </th>
          <th>Job Title</th>
          <th>Company</th>
          <th>Applied Date</th>
          <th>Status</th>
          <th>Referred By</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, index) => (
          <tr key={job.id}>
            <th>{index+1}</th>
            <td className="w-80">
              <Link href={job.jobLink ?? "#"} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:text-blue-700">
                {job.jobTitle}
              </Link>
            </td>
            <td>{job.companyName}</td>
            <td>{new Date(job.appliedDate).toLocaleString()}</td>
            <td>{job.status}</td>
            <td>{job.referralPerson}</td>
            <td>
              <button onClick={() => onStatusUpdate(job)} className="btn btn-ghost btn-xs">
                Update Status
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default JobApplicationTable;
