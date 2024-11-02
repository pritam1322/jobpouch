'use client';
import { trpc } from '@/trpc-client/client';
import { useSession } from 'next-auth/react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Import ArcElement
} from 'chart.js';
import { useRouter } from 'next/navigation';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DataAnalysis = () => {
  const { data: session } = useSession();
  const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;
  const router = useRouter();

  // Fetch job applications
  const { data: jobs, isLoading } = trpc.getApplication.useQuery(
    {
      where: {
        candidateId: candidateId ?? 0,
      },
    },
    {
      enabled: !!candidateId,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  // Initialize jobArray safely
  const jobArray = Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];

  // Define the type for status counts accumulator
  interface StatusCounts {
    [key: string]: number; // Allow dynamic keys of type string
  }

  // Example data processing for status counts
  const statusCounts: StatusCounts = jobArray.reduce((acc: StatusCounts, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1; // Count each status
    return acc;
  }, {});

  const companyCounts: StatusCounts = jobArray.reduce((acc: StatusCounts, job) => {
    acc[job.jobTitle] = (acc[job.jobTitle] || 0) + 1; // Count each status
    return acc;
  }, {});

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'Application Status',
      data: Object.values(statusCounts),
      backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)', 'rgba(255,206,86,0.6)']
    }]
  };

  const companyChartData = {
    labels: Object.keys(companyCounts),
    datasets: [{
      label: 'Companies Applied',
      data: Object.values(companyCounts),
      backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)', 'rgba(255,206,86,0.6)']
    }]
  };

  return (
    <section>
      <div className='max-w-3xl ml-8 mt-8'>
        <h1 className='font-semibold'>Job Application Data Analysis</h1>
        {statusChartData.labels.length > 0 ? (
          <Bar data={statusChartData} />
        ) : (
          <p>No job applications found.</p>
        )}
      </div>
      <div className='max-w-xl mx-auto ml-8 mt-8'>
        <h1 className='font-semibold'>Companies Data Analysis</h1>
        {companyChartData.labels.length > 0 ? (
          <Pie data={companyChartData} height={50} />
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
      <div className="border bg-blue-600 text-white flex max-w-28 rounded-lg m-8 ml-auto">
        <button
          onClick={() => router.push('/viewJobApplication')}
          className="px-2 py-1 w-full text-center font-medium hover:bg-blue-700 rounded-lg transition-colors duration-200"
        >
          Back
        </button>
      </div>
    </section>
  );
};

export default DataAnalysis;
