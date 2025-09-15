import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import JobCard from '@/components/JobCard';

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

interface SavedJob {
  _id: string;
  job: Job;
  savedAt: string;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/saved-jobs');
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/saved-jobs/${jobId}`);
      setSavedJobs(savedJobs.filter(saved => saved.job._id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Save Jobs You Love</h2>
        <p className="text-gray-600 mb-8">
          Please log in to view your saved jobs
        </p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-lg text-gray-600">
          Jobs you've saved for later consideration
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-600">
            Start browsing jobs and save the ones you're interested in
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {savedJobs.length} saved job{savedJobs.length === 1 ? '' : 's'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((savedJob) => (
              <JobCard
                key={savedJob._id}
                job={savedJob.job}
                onUnsave={handleUnsaveJob}
                isSaved={true}
                showSaveButton={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}