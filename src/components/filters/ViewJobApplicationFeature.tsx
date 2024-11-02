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
    <div className="mt-4 flex gap-4 items-center bg-blue-100 p-8">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Search Filter</label>
        <input
          type="text"
          placeholder="Search by job title or company name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded p-2 font-semibold text-gray-600"
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="In Progress">In Progress</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="flex gap-4 mt-4 p-4 items-center">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-800">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-800">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
    </div>
  );
}
