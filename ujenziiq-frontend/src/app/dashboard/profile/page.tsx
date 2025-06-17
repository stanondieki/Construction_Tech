'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, Mail, Phone, MapPin, Calendar, Building, 
  Edit, Save, X, Camera, Award, Clock, Activity,
  BarChart3, CheckCircle, AlertTriangle, Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  userType: string;
  organization?: string;
  joinDate: string;
  avatar?: string;
  skills?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  socialLinks?: {
    linkedin?: string;
    website?: string;
  };
}

interface UserStats {
  projectsCompleted: number;
  tasksCompleted: number;
  hoursWorked: number;
  safetyScore: number;
  teamCollaborations: number;
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch full user profile
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Mock data - in real app, this would come from API
        const mockProfile: UserProfile = {
          id: authUser?.id || '1',
          firstName: authUser?.firstName || 'Stanley',
          lastName: authUser?.lastName || 'Ndieki',
          email: authUser?.email || 'stanley.ndieki@contech.com',
          phone: '+254 712 345 678',
          location: 'Nairobi, Kenya',
          bio: 'Experienced project manager with 8+ years in construction technology and project coordination. Passionate about leveraging technology to improve construction processes and safety standards.',
          userType: authUser?.userType || 'project_manager',
          organization: 'ConTech Solutions Ltd',
          joinDate: '2020-03-15',
          avatar: 'SN',
          skills: ['Project Management', 'Construction Planning', 'Team Leadership', 'Risk Assessment', 'Quality Control', 'Safety Management'],
          certifications: [
            { name: 'PMP Certification', issuer: 'Project Management Institute', date: '2019-06-15' },
            { name: 'Construction Safety Officer', issuer: 'Kenya Bureau of Standards', date: '2018-11-20' },
            { name: 'LEED Green Associate', issuer: 'Green Building Council', date: '2021-03-10' }
          ],
          socialLinks: {
            linkedin: 'https://linkedin.com/in/stanley-ndieki',
            website: 'https://stanley-ndieki.com'
          }
        };

        const mockStats: UserStats = {
          projectsCompleted: 24,
          tasksCompleted: 156,
          hoursWorked: 2840,
          safetyScore: 98,
          teamCollaborations: 45
        };

        setUser(mockProfile);
        setUserStats(mockStats);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getUserTypeLabel = (userType: string) => {
    const types: Record<string, string> = {
      'admin': 'Administrator',
      'project_manager': 'Project Manager',
      'site_engineer': 'Site Engineer',
      'worker': 'Construction Worker',
      'client': 'Client',
      'supplier': 'Supplier'
    };
    return types[userType] || userType;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                  {user.avatar || `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-4 right-6">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="mt-8 space-y-4">
              <div>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={user.firstName}
                      onChange={(e) => setUser({...user, firstName: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={user.lastName}
                      onChange={(e) => setUser({...user, lastName: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  <span>{getUserTypeLabel(user.userType)}</span>
                </div>
                {user.organization && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    <span>{user.organization}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span>{user.phone}</span>
                    )}
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.location}
                        onChange={(e) => setUser({...user, location: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span>{user.location}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={user.bio || ''}
                  onChange={(e) => setUser({...user, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600">
                  {user.bio || 'No bio available.'}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-3">
                {user.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">Issued: {new Date(cert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats Card */}
            {userStats && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Projects Completed</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userStats.projectsCompleted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Tasks Completed</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userStats.tasksCompleted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">Hours Worked</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userStats.hoursWorked.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Safety Score</span>
                    </div>
                    <span className="font-semibold text-green-600">{userStats.safetyScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-sm text-gray-600">Team Collaborations</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userStats.teamCollaborations}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 mr-3" />
                  Account Settings
                </Link>
                
                <Link
                  href="/dashboard/tasks"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Activity className="w-4 h-4 mr-3" />
                  View My Tasks
                </Link>
                
                <Link
                  href="/dashboard/projects"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Building className="w-4 h-4 mr-3" />
                  My Projects
                </Link>
                
                <Link
                  href="/dashboard/reports"
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Performance Reports
                </Link>
              </div>
            </div>

            {/* Social Links */}
            {user.socialLinks && (Object.keys(user.socialLinks).length > 0) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect</h2>
                <div className="space-y-2">
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Personal Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
