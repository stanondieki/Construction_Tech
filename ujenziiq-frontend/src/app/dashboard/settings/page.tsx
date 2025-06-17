'use client';

import React, { useState } from 'react';
import { 
  User, Bell, Shield, Palette, Monitor, 
  Save, Eye, EyeOff, Camera, MapPin, Clock,
  Smartphone, Mail, Database, Download,
  Trash2, RefreshCw, LogOut, HelpCircle
} from 'lucide-react';

interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  bio: string;
  avatar?: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  projectUpdates: boolean;
  safetyAlerts: boolean;
  messageNotifications: boolean;
  weeklyReports: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  autoSync: boolean;
  offlineMode: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance' | 'data'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    firstName: 'Stanley',
    lastName: 'Ndieki',
    email: 'stanley.ndieki@contech.com',
    phone: '+254 712 345 678',
    role: 'Project Manager',
    location: 'Nairobi, Kenya',
    bio: 'Experienced project manager with 8+ years in construction technology and project coordination.',
    avatar: 'SN'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginAlerts: true
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    projectUpdates: true,
    safetyAlerts: true,
    messageNotifications: true,
    weeklyReports: false
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    currency: 'KES',
    autoSync: true,
    offlineMode: false
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    alert('Data export will be sent to your email within 24 hours.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. You will receive confirmation instructions via email.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and application settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                  
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
                        {profileSettings.avatar}
                      </div>
                      <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Profile Photo</h4>
                      <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileSettings.firstName}
                        onChange={(e) => setProfileSettings({...profileSettings, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileSettings.lastName}
                        onChange={(e) => setProfileSettings({...profileSettings, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileSettings.phone}
                        onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        value={profileSettings.role}
                        onChange={(e) => setProfileSettings({...profileSettings, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={profileSettings.location}
                          onChange={(e) => setProfileSettings({...profileSettings, location: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileSettings.bio}
                      onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={securitySettings.currentPassword}
                              onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={securitySettings.newPassword}
                              onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={securitySettings.confirmPassword}
                              onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={(e) => setSecuritySettings({...securitySettings, twoFactorEnabled: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Login Alerts */}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Login Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified of suspicious login attempts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    {/* Communication Preferences */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">How you want to be notified</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, desc: 'Receive notifications via email' },
                          { key: 'pushNotifications', label: 'Push Notifications', icon: Smartphone, desc: 'Browser and mobile push notifications' },
                          { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone, desc: 'Text message notifications for urgent items' }
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200">
                              <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">{item.label}</h5>
                                  <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                                  onChange={(e) => setNotificationSettings({
                                    ...notificationSettings,
                                    [item.key]: e.target.checked
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Content Preferences */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">What you want to be notified about</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'projectUpdates', label: 'Project Updates', desc: 'Changes to project status, milestones, and deadlines' },
                          { key: 'safetyAlerts', label: 'Safety Alerts', desc: 'Important safety notifications and incident reports' },
                          { key: 'messageNotifications', label: 'New Messages', desc: 'Direct messages and team communications' },
                          { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of project progress and team activity' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{item.label}</h5>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  [item.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance & Localization</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select
                          value={appSettings.theme}
                          onChange={(e) => setAppSettings({...appSettings, theme: e.target.value as 'light' | 'dark' | 'system'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={appSettings.language}
                          onChange={(e) => setAppSettings({...appSettings, language: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="sw">Swahili</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <select
                            value={appSettings.timezone}
                            onChange={(e) => setAppSettings({...appSettings, timezone: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                            <option value="UTC">UTC (GMT+0)</option>
                            <option value="America/New_York">America/New_York (GMT-5)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select
                          value={appSettings.dateFormat}
                          onChange={(e) => setAppSettings({...appSettings, dateFormat: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={appSettings.currency}
                          onChange={(e) => setAppSettings({...appSettings, currency: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="KES">KES - Kenyan Shilling</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>
                    </div>

                    {/* App Preferences */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">Application Preferences</h4>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">Auto Sync</h5>
                          <p className="text-sm text-gray-500">Automatically sync data when online</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appSettings.autoSync}
                            onChange={(e) => setAppSettings({...appSettings, autoSync: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">Offline Mode</h5>
                          <p className="text-sm text-gray-500">Enable offline functionality</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appSettings.offlineMode}
                            onChange={(e) => setAppSettings({...appSettings, offlineMode: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h3>
                  
                  <div className="space-y-6">
                    {/* Data Export */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Export Your Data</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Download a copy of all your data including projects, messages, and activity logs.
                          </p>
                          <button
                            onClick={handleExportData}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Request Data Export
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Data Sync */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <RefreshCw className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Sync Status</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Last synced: Today at 2:30 PM
                          </p>
                          <button className="mt-3 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                            Force Sync Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-start space-x-3">
                        <Trash2 className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            onClick={handleDeleteAccount}
                            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Monitor className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Current Session</p>
                              <p className="text-xs text-gray-500">Chrome on Windows • Nairobi, Kenya</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Mobile App</p>
                              <p className="text-xs text-gray-500">Last active 2 hours ago</p>
                            </div>
                          </div>
                          <button className="text-xs text-red-600 hover:text-red-800">
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <HelpCircle className="w-4 h-4" />
                <span>Need help? Contact support</span>
              </div>
              
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}