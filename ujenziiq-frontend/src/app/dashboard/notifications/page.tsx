'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, Check, Archive, Trash2, Filter, 
  AlertCircle, CheckCircle, Info, AlertTriangle,
  Clock, User, Building, Calendar
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'project' | 'task' | 'safety' | 'message' | 'system';
  read: boolean;
  archived: boolean;
  timestamp: string;
  relatedTo?: {
    id: string;
    name: string;
    type: 'project' | 'task' | 'user';
  };
  actions?: Array<{
    label: string;
    href?: string;
    action?: () => void;
  }>;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'project' | 'task' | 'safety' | 'message' | 'system'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'New Task Assigned',
            message: 'You have been assigned a new task: "Foundation inspection" for Residential Complex project.',
            type: 'info',
            category: 'task',
            read: false,
            archived: false,
            timestamp: '2025-06-17T14:30:00Z',
            relatedTo: {
              id: 'task-1',
              name: 'Foundation inspection',
              type: 'task'
            },
            actions: [
              { label: 'View Task', href: '/dashboard/tasks/1' }
            ]
          },
          {
            id: '2',
            title: 'Safety Incident Reported',
            message: 'A new safety incident has been reported at the Commercial Tower site. Immediate attention required.',
            type: 'warning',
            category: 'safety',
            read: false,
            archived: false,
            timestamp: '2025-06-17T13:15:00Z',
            relatedTo: {
              id: 'incident-1',
              name: 'Equipment malfunction',
              type: 'project'
            },
            actions: [
              { label: 'View Incident', href: '/dashboard/safety/1' }
            ]
          },
          {
            id: '3',
            title: 'Project Status Updated',
            message: 'Highway Expansion project status has been changed to "On Hold" due to environmental clearance delays.',
            type: 'warning',
            category: 'project',
            read: true,
            archived: false,
            timestamp: '2025-06-17T10:45:00Z',
            relatedTo: {
              id: 'project-3',
              name: 'Highway Expansion',
              type: 'project'
            },
            actions: [
              { label: 'View Project', href: '/dashboard/projects/3' }
            ]
          },
          {
            id: '4',
            title: 'Meeting Reminder',
            message: 'Project review meeting scheduled for tomorrow at 10:00 AM with the client team.',
            type: 'info',
            category: 'project',
            read: true,
            archived: false,
            timestamp: '2025-06-17T09:00:00Z',
            actions: [
              { label: 'View Calendar', href: '/dashboard/calendar' }
            ]
          },
          {
            id: '5',
            title: 'Task Completed',
            message: 'Jane Smith has marked the task "Electrical wiring installation" as completed.',
            type: 'success',
            category: 'task',
            read: true,
            archived: false,
            timestamp: '2025-06-16T16:30:00Z',
            relatedTo: {
              id: 'task-2',
              name: 'Electrical wiring installation',
              type: 'task'
            }
          },
          {
            id: '6',
            title: 'New Message',
            message: 'David Kimani sent you a message regarding the material delivery schedule.',
            type: 'info',
            category: 'message',
            read: true,
            archived: false,
            timestamp: '2025-06-16T14:20:00Z',
            relatedTo: {
              id: 'user-3',
              name: 'David Kimani',
              type: 'user'
            },
            actions: [
              { label: 'View Messages', href: '/dashboard/messages' }
            ]
          },
          {
            id: '7',
            title: 'System Maintenance',
            message: 'Scheduled system maintenance will occur this weekend from 2:00 AM to 6:00 AM.',
            type: 'info',
            category: 'system',
            read: true,
            archived: true,
            timestamp: '2025-06-15T08:00:00Z'
          },
          {
            id: '8',
            title: 'Budget Alert',
            message: 'Residential Complex project has exceeded 80% of allocated budget. Review required.',
            type: 'warning',
            category: 'project',
            read: false,
            archived: false,
            timestamp: '2025-06-14T11:30:00Z',
            relatedTo: {
              id: 'project-1',
              name: 'Residential Complex',
              type: 'project'
            },
            actions: [
              { label: 'View Budget', href: '/dashboard/projects/1/budget' }
            ]
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'archived' && !notification.archived) return false;
    if (filter === 'all' && notification.archived) return false;
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, archived: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(notifId => notifId !== id) : [...prev, id]
    );
  };

  const markSelectedAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => 
        selectedNotifications.includes(notification.id) 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  const archiveSelected = () => {
    setNotifications(prev => 
      prev.map(notification => 
        selectedNotifications.includes(notification.id) 
          ? { ...notification, archived: true } 
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return <Building className="w-4 h-4" />;
      case 'task': return <Check className="w-4 h-4" />;
      case 'safety': return <AlertTriangle className="w-4 h-4" />;
      case 'message': return <User className="w-4 h-4" />;
      case 'system': return <Bell className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bell className="w-6 h-6 mr-2" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="project">Projects</option>
                <option value="task">Tasks</option>
                <option value="safety">Safety</option>
                <option value="message">Messages</option>
                <option value="system">System</option>
              </select>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={markSelectedAsRead}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark Read
                </button>
                <button
                  onClick={archiveSelected}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'unread' ? "You're all caught up!" : 'No notifications match your current filter.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelection(notification.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">{notification.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`mt-1 text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    {notification.relatedTo && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Related to: {notification.relatedTo.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between">
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2">
                          {notification.actions.map((action, index) => (
                            <Link
                              key={index}
                              href={action.href || '#'}
                              className="text-xs font-medium text-blue-600 hover:text-blue-500"
                            >
                              {action.label}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {!notification.read ? (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-500 hover:text-blue-600"
                          >
                            Mark as read
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            className="text-xs text-gray-500 hover:text-blue-600"
                          >
                            Mark as unread
                          </button>
                        )}
                        
                        {!notification.archived && (
                          <button
                            onClick={() => archiveNotification(notification.id)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Archive
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
