import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';
import JobCard from '@/components/JobCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3000/api/jobs/search', {
        params: {
          title: searchTerm,
          location: location,
        },
      });
      setJobs(response.data);
      setSearched(true);

      if (user) {
        fetchSavedJobs();
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Search Jobs</h1>
        <p className="text-lg text-gray-600">
          Find the perfect job that matches your skills and preferences
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Job title, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button type="submit" disabled={loading} className="md:w-auto">
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results ({jobs.length} jobs found)
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse all jobs
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}