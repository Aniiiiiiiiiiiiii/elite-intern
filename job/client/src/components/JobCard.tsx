import React from 'react';
import { MapPin, Clock, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

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

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onUnsave?: (jobId: string) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

export default function JobCard({ 
  job, 
  onSave, 
  onUnsave, 
  isSaved = false, 
  showSaveButton = true 
}: JobCardProps) {
  const { user } = useAuth();

  const handleSaveToggle = () => {
    if (!user) return;
    
    if (isSaved && onUnsave) {
      onUnsave(job._id);
    } else if (!isSaved && onSave) {
      onSave(job._id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-primary-600 font-medium">{job.company}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{job.type}</span>
              </div>
            </div>
          </div>
          
          {user && showSaveButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToggle}
              className={`p-2 ${isSaved ? 'text-red-600 hover:text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
          )}
        </div>

        <p className="text-gray-700 text-sm line-clamp-3">
          {job.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-lg font-semibold text-gray-900">{job.salary}</span>
          <Button size="sm">
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
}