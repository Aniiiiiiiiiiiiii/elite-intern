import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '@/components/JobCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  type: string;
  createdAt: string;
}

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [page, user]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/jobs?page=${page}&limit=6`);
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/saved-jobs');
      setSavedJobs(response.data.map((saved: any) => saved.job._id));
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await axios.post('http://localhost:3000/api/saved-jobs', { jobId });
      setSavedJobs([...savedJobs, jobId]);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/saved-jobs/${jobId}`);
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
        <p className="text-lg text-gray-600">
          Discover amazing opportunities from top companies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onSave={handleSaveJob}
            onUnsave={handleUnsaveJob}
            isSaved={savedJobs.includes(job._id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}