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
  const [searchTerm, setSearchTerm] = useState(''); // Track the search input for filtering
  const [selectedStatus, setSelectedStatus] = useState(''); // Track selected status

  // Filter logic based on search term and status
  useEffect(() => {
    const handleFilter = () => {
      const filtered = jobArray.filter((job) => {
        // Check if the job matches the search term (job title or company name)
        const matchesSearchTerm = (
          (job.jobTitle && job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) || 
          (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Check if the job matches the selected status (if any)
        const matchesStatus = selectedStatus ? job.status === selectedStatus : true;

        return matchesSearchTerm && matchesStatus;
      });

      // Pass the filtered job list to the parent component
      onFilter(filtered);
    };

    handleFilter();
  }, [searchTerm, selectedStatus, jobArray, onFilter]);

  // Handle change in search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle change in status dropdown
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="mt-4 flex gap-4 items-center bg-blue-100 p-8">
      {/* Search input for filtering by job title or company name */}
      <div className=''>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Search Filter
        </label>
        <input
          type="text"
          placeholder="Search by job title or company name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded p-2"
        />
      </div>

      {/* Dropdown for filtering by status */}
      <div className=''>
        <label className="block text-sm font-medium text-gray-800 mb-1 w-auto">
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded p-2 font-semibold text-gray-600"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
