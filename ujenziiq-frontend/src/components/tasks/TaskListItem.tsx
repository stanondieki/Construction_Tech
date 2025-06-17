import Link from 'next/link';
import { formatDate, cn, getStatusColor } from '@/lib/utils/helpers';
import { ClockIcon } from '@/components/icons/Icons';

type Task = {
  id: string;
  name: string;
  project: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    name: string;
  };
  status: string;
  priority: string;
  dueDate: string;
};

type TaskListItemProps = {
  task: Task;
};

export function TaskListItem({ task }: TaskListItemProps) {
  const { id, name, project, assignee, status, priority, dueDate } = task;
  
  // Format status and priority for display
  const displayStatus = status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const dueDateColor = new Date(dueDate) < new Date() && status !== 'completed' 
    ? 'text-red-600' 
    : 'text-gray-500';
  
  return (
    <li className="py-4 px-6 hover:bg-gray-50">
      <Link href={`/dashboard/tasks/${id}`} className="block">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <span className="truncate">Project: {project.name}</span>
              <span className="mx-1">•</span>
              <span>Assigned to: {assignee.name}</span>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0 flex items-center">
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'
            )}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
            
            <span className={cn(
              'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusColor(status).replace('bg-', 'bg-opacity-10 text-')
            )}>
              {displayStatus}
            </span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <ClockIcon className={`flex-shrink-0 mr-1.5 h-4 w-4 ${dueDateColor}`} />
          <span className={dueDateColor}>Due {formatDate(dueDate)}</span>
        </div>
      </Link>
    </li>
  );
}
