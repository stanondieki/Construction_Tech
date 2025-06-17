'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertTriangle, MapPin, Calendar, User, FileText, Camera, Upload, X } from 'lucide-react';
import Link from 'next/link';

interface IncidentFormData {
  title: string;
  description: string;
  location: string;
  dateOccurred: string;
  timeOccurred: string;
  severity: string;
  category: string;
  projectId: string;
  witnessName: string;
  witnessContact: string;
  immediateAction: string;
  rootCause: string;
  preventiveMeasures: string;
  attachments: File[];
}

interface Project {
  id: string;
  name: string;
}

export default function ReportIncidentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<IncidentFormData>({
    title: '',
    description: '',
    location: '',
    dateOccurred: '',
    timeOccurred: '',
    severity: 'medium',
    category: 'injury',
    projectId: '',
    witnessName: '',
    witnessContact: '',
    immediateAction: '',
    rootCause: '',
    preventiveMeasures: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Partial<IncidentFormData>>({});

  useEffect(() => {
    // Load projects for dropdown
    const loadProjects = async () => {
      try {
        // In real implementation, fetch from API
        const mockProjects: Project[] = [
          { id: '1', name: 'Residential Complex' },
          { id: '2', name: 'Commercial Tower' },
          { id: '3', name: 'Highway Expansion' },
          { id: '4', name: 'School Renovation' },
          { id: '5', name: 'Solar Power Plant' },
          { id: '6', name: 'Water Treatment Facility' }
        ];
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();

    // Set current date and time as defaults
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setFormData(prev => ({
      ...prev,
      dateOccurred: currentDate,
      timeOccurred: currentTime
    }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<IncidentFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Incident title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.dateOccurred) newErrors.dateOccurred = 'Date is required';
    if (!formData.timeOccurred) newErrors.timeOccurred = 'Time is required';
    if (!formData.projectId) newErrors.projectId = 'Project selection is required';
    if (!formData.immediateAction.trim()) newErrors.immediateAction = 'Immediate action taken is required';

    // Validate date is not in the future
    const incidentDateTime = new Date(`${formData.dateOccurred}T${formData.timeOccurred}`);
    if (incidentDateTime > new Date()) {
      newErrors.dateOccurred = 'Incident date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call with file upload
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, you would call your API here:
      // const formDataToSend = new FormData();
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (key === 'attachments') {
      //     value.forEach(file => formDataToSend.append('attachments', file));
      //   } else {
      //     formDataToSend.append(key, value);
      //   }
      // });
      // const response = await safetyAPI.reportIncident(formDataToSend);
      
      alert('Safety incident reported successfully!');
      router.push('/dashboard/safety');
    } catch (error) {
      console.error('Error reporting incident:', error);
      alert('Error reporting incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof IncidentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'];

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles].slice(0, 5) // Max 5 files
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/safety"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Safety Dashboard
          </Link>
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report Safety Incident</h1>
              <p className="text-gray-600 mt-1">Document and report a safety incident or near-miss</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Incident Overview */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-6">
              <FileText className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Incident Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of the incident"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${getSeverityColor(formData.severity)}`}
                >
                  <option value="low">Low - Minor incident, no injury</option>
                  <option value="medium">Medium - Minor injury or property damage</option>
                  <option value="high">High - Significant injury or damage</option>
                  <option value="critical">Critical - Serious injury or major damage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="injury">Personal Injury</option>
                  <option value="near_miss">Near Miss</option>
                  <option value="property_damage">Property Damage</option>
                  <option value="environmental">Environmental</option>
                  <option value="equipment">Equipment Failure</option>
                  <option value="security">Security Incident</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.projectId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Specific location where incident occurred"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Occurred *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.dateOccurred}
                    onChange={(e) => handleInputChange('dateOccurred', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.dateOccurred ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dateOccurred && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOccurred}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Occurred *
                </label>
                <input
                  type="time"
                  value={formData.timeOccurred}
                  onChange={(e) => handleInputChange('timeOccurred', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.timeOccurred ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.timeOccurred && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeOccurred}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed description of what happened, including sequence of events, people involved, and conditions at the time..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Witness Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Witness Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witness Name
                </label>
                <input
                  type="text"
                  value={formData.witnessName}
                  onChange={(e) => handleInputChange('witnessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Name of witness (if any)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witness Contact
                </label>
                <input
                  type="text"
                  value={formData.witnessContact}
                  onChange={(e) => handleInputChange('witnessContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Phone number or email"
                />
              </div>
            </div>
          </div>

          {/* Response and Analysis */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Response & Analysis</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immediate Action Taken *
                </label>
                <textarea
                  value={formData.immediateAction}
                  onChange={(e) => handleInputChange('immediateAction', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.immediateAction ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe what was done immediately after the incident..."
                />
                {errors.immediateAction && (
                  <p className="mt-1 text-sm text-red-600">{errors.immediateAction}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Root Cause Analysis
                </label>
                <textarea
                  value={formData.rootCause}
                  onChange={(e) => handleInputChange('rootCause', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="What do you think caused this incident? Include contributing factors..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preventive Measures
                </label>
                <textarea
                  value={formData.preventiveMeasures}
                  onChange={(e) => handleInputChange('preventiveMeasures', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="What measures should be taken to prevent similar incidents in the future?"
                />
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Camera className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Evidence & Attachments</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload photos, videos, or documents
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, GIF, PDF, MP4 up to 10MB (max 5 files)
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept="image/*,application/pdf,video/mp4"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 py-6">
            <Link
              href="/dashboard/safety"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Report Incident</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
