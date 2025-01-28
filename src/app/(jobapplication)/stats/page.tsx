'use client';
import { trpc } from '@/trpc-client/client';
import { useSession } from 'next-auth/react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

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

  // Initialize jobArray safely
  const jobArray = useMemo(() => (Array.isArray(jobs) ? jobs : jobs ? [jobs] : []), [jobs]);

  // Define the type for status counts accumulator
  interface StatusCounts {
    [key: string]: number;
  }

  // Count statuses
  const statusCounts: StatusCounts = jobArray.reduce((acc: StatusCounts, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Count companies
  const companyCounts: StatusCounts = jobArray.reduce((acc: StatusCounts, job) => {
    acc[job.jobTitle] = (acc[job.jobTitle] || 0) + 1;
    return acc;
  }, {});

  // Dynamic color generator
  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`);
    }
    return colors;
  };

  // Chart data for status distribution
  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'Application Status',
      data: Object.values(statusCounts),
      backgroundColor: generateColors(Object.keys(statusCounts).length),
    }],
  };

  // Chart data for companies applied
  const companyChartData = {
    labels: Object.keys(companyCounts),
    datasets: [{
      label: 'Companies Applied',
      data: Object.values(companyCounts),
      backgroundColor: generateColors(Object.keys(companyCounts).length),
    }],
  };

  // Chart data for application timeline
  // Timeline chart data
const timelineChartData = {
  labels: jobArray.map((job) => new Date(job.appliedDate).toLocaleDateString()), // Use appliedDate instead of createdAt
  datasets: [{
    label: 'Applications Over Time',
    data: jobArray.map((job, index) => index + 1),
    borderColor: 'rgba(75,192,192,0.6)',
    fill: false,
  }],
};


  // Chart data for interview success rate
  const interviewSuccessChartData = {
    labels: ['Successful', 'Unsuccessful'],
    datasets: [{
      label: 'Interview Success Rate',
      data: [
        jobArray.filter((job) => job.status === 'Offer').length,
        jobArray.filter((job) => job.status === 'Rejected').length,
      ],
      backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
    }],
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="w-full p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col text-gray-100 mb-6">
        <span className="font-bold lg:text-2xl sm:text-xl">Analytics</span>
        <span className="text-sm text-gray-400">Analyze your job applications</span>
      </div>

      {/* Application stages count */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded border bg-stone-800">
          <h3 className="text-gray-100">Success Rate</h3>
          <p className="text-2xl font-bold mt-2">
            {jobArray.length ? ((jobArray.filter((job) => job.status === 'Offer' || job.status === 'Interview').length * 100) / jobArray.length).toFixed(2) + '%' : '0%'}
          </p>
        </div>
        <div className="p-4 rounded border bg-stone-800">
          <h3 className="text-gray-100">Interview Rate</h3>
          <p className="text-2xl font-bold mt-2">
            {jobArray.length ? ((jobArray.filter((job) => job.status === 'Interview').length * 100) / jobArray.length).toFixed(2) + '%' : '0%'}
          </p>
        </div>
        <div className="p-4 rounded border bg-stone-800">
          <h3 className="text-gray-100">Offer Conversion</h3>
          <p className="text-2xl font-bold mt-2">
            {jobArray.length ? ((jobArray.filter((job) => job.status === 'Offer').length * 100) / jobArray.length).toFixed(2) + '%' : '0%'}
          </p>
        </div>
        <div className="p-4 rounded border bg-stone-800">
          <h3 className="text-gray-100">Total Applications</h3>
          <p className="text-2xl font-bold mt-2">{jobArray.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

        {/* Application Timeline */}
        <div className="p-6 rounded border border-gray-200">
          <h3 className="font-semibold mb-4">Application Timeline</h3>
          <div className="h-64">
            <Line data={timelineChartData} />
          </div>
        </div>

        {/* Response Time Analysis */}
        <div className="p-6 rounded border border-gray-200">
          <h3 className="font-semibold mb-4">Application Status</h3>
          <div className="h-64">
            <Bar data={statusChartData} />
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="p-6 rounded border border-gray-200">
          <h3 className="font-semibold mb-4">Application Status Distribution</h3>
          <div className="h-64">
            <Pie data={statusChartData} />
          </div>
        </div>

        {/* Interview Success Rate */}
        <div className="p-6 rounded border border-gray-200">
          <h3 className="font-semibold mb-4">Interview Success Rate</h3>
          <div className="h-64">
            <Doughnut data={interviewSuccessChartData} />
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="border bg-blue-600 text-white flex max-w-28 rounded-lg mt-8 ml-auto">
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