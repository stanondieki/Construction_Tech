import Link from 'next/link';
import { formatDate, formatCurrency, calculatePercentage, getStatusColor, cn } from '@/lib/utils/helpers';

type Project = {
  id: string;
  name: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  description: string;
  clientName: string;
};

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { id, name, location, status, progress, budget, startDate, endDate } = project;
  
  // Format status string for display
  const displayStatus = status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());
  
  return (
    <Link 
      href={`/dashboard/projects/${id}`}
      className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 truncate">{name}</h3>
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            getStatusColor(status).replace('bg-', 'bg-opacity-10 text-')
          )}>
            {displayStatus}
          </span>
        </div>
        
        <p className="mt-1 text-sm text-gray-500">{location}</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full",
                progress < 25 ? "bg-red-500" : 
                progress < 75 ? "bg-yellow-500" : 
                "bg-green-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-medium text-gray-900">{formatCurrency(budget)}</p>
          </div>
          <div>
            <p className="text-gray-500">Timeline</p>
            <p className="font-medium text-gray-900">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
