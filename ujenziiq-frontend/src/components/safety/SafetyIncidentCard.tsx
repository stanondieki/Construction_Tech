import Link from 'next/link';
import { formatDate, cn, getStatusColor } from '@/lib/utils/helpers';
import { AlertCircleIcon } from '@/components/icons/Icons';

type SafetyIncident = {
  id: string;
  title: string;
  project: {
    id: string;
    name: string;
  };
  reportedBy: {
    id: string;
    name: string;
  };
  status: string;
  severity: string;
  date: string;
  description: string;
};

type SafetyIncidentCardProps = {
  incident: SafetyIncident;
};

export function SafetyIncidentCard({ incident }: SafetyIncidentCardProps) {
  const { id, title, project, reportedBy, status, severity, date, description } = incident;
  
  // Format status and severity for display
  const displayStatus = status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());
  
  const severityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
    critical: 'bg-purple-100 text-purple-800',
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <Link href={`/dashboard/safety/${id}`} className="block">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircleIcon 
              className={cn(
                "h-5 w-5",
                severity === 'high' || severity === 'critical' ? "text-red-500" : "text-orange-500"
              )} 
            />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                severityColors[severity as keyof typeof severityColors] || 'bg-gray-100 text-gray-800'
              )}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </span>
            </div>
            
            <div className="mt-1 text-xs text-gray-500">
              <span>Project: {project.name}</span>
              <span className="mx-1">•</span>
              <span>Reported by: {reportedBy.name}</span>
            </div>
            
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
            
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(status).replace('bg-', 'bg-opacity-10 text-')
              )}>
                {displayStatus}
              </span>
              
              <span className="text-gray-500">{formatDate(date)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
