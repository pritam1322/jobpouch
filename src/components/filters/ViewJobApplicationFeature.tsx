import React, { useState, useEffect } from 'react';

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

interface ViewJobApplicationFilterProps {
  jobArray: JobApplication[]; // List of jobs to filter
  onFilter: (filteredJobs: JobApplication[]) => void; // Callback to apply the filter
}

export default function ViewJobApplicationFilter({ jobArray, onFilter }: ViewJobApplicationFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const filtered = jobArray.filter((job) => {
      const matchesSearchTerm =
        (job.jobTitle && job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = selectedStatus ? job.status === selectedStatus : true;
      const appliedDate = new Date(job.appliedDate);
      const matchesStartDate = startDate ? appliedDate >= new Date(startDate) : true;
      const matchesEndDate = endDate ? appliedDate <= new Date(endDate) : true;
      return matchesSearchTerm && matchesStatus && matchesStartDate && matchesEndDate;
    });

    onFilter(filtered);
  }, [searchTerm, selectedStatus, startDate, endDate, jobArray, onFilter]);

  return (
    <div className="mt-4 lg:flex lg:gap-4 items-center rounded-md text-gray-100 bg-cyan-700 lg:px-8 lg:py-2 p-4 ">
      <div>
        <label className="block text-sm mb-1 font-bold">Search Filter</label>
        <input
          type="text"
          placeholder="Search by job title or company name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="In Progress">In Progress</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="lg:flex lg:gap-4  lg:p-4 items-center">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
      </div>
    </div>
  );
}
