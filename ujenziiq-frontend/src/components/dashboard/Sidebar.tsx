'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { 
  HomeIcon, 
  ClipboardCheckIcon, 
  CubeIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  ChatIcon, 
  UserGroupIcon, 
  CogIcon,
  MenuIcon,
  XIcon
} from '@/components/icons/Icons';

// Navigation items with access control based on user role
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, allowedRoles: ['all'] },
  { name: 'Projects', href: '/dashboard/projects', icon: ClipboardCheckIcon, allowedRoles: ['all'] },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardCheckIcon, allowedRoles: ['all'] },
  { name: 'Materials', href: '/dashboard/materials', icon: CubeIcon, allowedRoles: ['admin', 'project_manager', 'site_engineer'] },
  { name: 'Safety', href: '/dashboard/safety', icon: ShieldCheckIcon, allowedRoles: ['all'] },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon, allowedRoles: ['admin', 'project_manager', 'client'] },
  { name: 'Messages', href: '/dashboard/messages', icon: ChatIcon, allowedRoles: ['all'] },
  { name: 'Team', href: '/dashboard/team', icon: UserGroupIcon, allowedRoles: ['admin', 'project_manager'] },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, allowedRoles: ['all'] },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(
    item => item.allowedRoles.includes('all') || (user?.userType && item.allowedRoles.includes(user.userType))
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 p-4 md:hidden">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">UjenziIQ</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-300',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <XIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-white">UjenziIQ</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-gray-300',
                          'mr-4 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
