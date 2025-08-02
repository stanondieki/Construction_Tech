'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldError } from "@/components/forms/FormFieldError";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    user_type: "worker",
    organization: "",
    position: "",
    phone_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Medium";
    return "Strong";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number) => {
    const newFieldErrors: Record<string, string> = {};
    let hasErrors = false;

    if (step === 1) {
      // Personal Information Step
      if (!formData.first_name.trim()) {
        newFieldErrors.first_name = "First name is required";
        hasErrors = true;
      }
      if (!formData.last_name.trim()) {
        newFieldErrors.last_name = "Last name is required";
        hasErrors = true;
      }
      if (!formData.email.trim()) {
        newFieldErrors.email = "Email is required";
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newFieldErrors.email = "Email is invalid";
        hasErrors = true;
      }
    } else if (step === 2) {
      // Account Setup Step
      if (!formData.username.trim()) {
        newFieldErrors.username = "Username is required";
        hasErrors = true;
      }
      if (!formData.password) {
        newFieldErrors.password = "Password is required";
        hasErrors = true;
      } else if (formData.password.length < 8) {
        newFieldErrors.password = "Password must be at least 8 characters";
        hasErrors = true;
      }
      if (formData.password !== formData.password2) {
        newFieldErrors.password2 = "Passwords do not match";
        hasErrors = true;
      }
    }

    setFieldErrors(newFieldErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});
    
    // Final validation for all steps
    if (!validateStep(1) || !validateStep(2)) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Submitting registration data:", { ...formData, password: "***", password2: "***" });
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/');
      await register(formData);
      console.log("Registration successful, redirecting to dashboard");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      
      if (typeof err === 'object' && err !== null && 'response' in err && 
          typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
        const serverErrors = err.response.data as Record<string, string[]>;
        const newFieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        for (const field in serverErrors) {
          const errorMessage = serverErrors[field].join(" ");
          
          if (field in formData) {
            newFieldErrors[field] = errorMessage;
          } else {
            generalErrors.push(`${field}: ${errorMessage}`);
          }
        }
        
        setFieldErrors(newFieldErrors);
        
        if (generalErrors.length > 0) {
          setError(generalErrors.join("\n"));
        }
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(`Network error: ${(err as Error).message}`);
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            currentStep === step 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : currentStep > step 
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {currentStep > step ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              currentStep > step ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
            <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            First Name *
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            value={formData.first_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              fieldErrors.first_name ? 'border-red-300 ring-red-100' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          <FormFieldError error={fieldErrors.first_name} />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
            <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Last Name *
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            value={formData.last_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              fieldErrors.last_name ? 'border-red-300 ring-red-100' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          <FormFieldError error={fieldErrors.last_name} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            fieldErrors.email ? 'border-red-300 ring-red-100' : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        <FormFieldError error={fieldErrors.email} />
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Phone Number
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );

  const renderAccountSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Account Setup</h3>
        <p className="text-sm text-gray-600">Create your login credentials</p>
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          Username *
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            fieldErrors.username ? 'border-red-300 ring-red-100' : 'border-gray-300'
          }`}
          placeholder="Choose a username"
        />
        <FormFieldError error={fieldErrors.username} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            fieldErrors.password ? 'border-red-300 ring-red-100' : 'border-gray-300'
          }`}
          placeholder="Create a strong password"
        />
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength < 2 ? 'text-red-600' : 
                passwordStrength < 4 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
        <FormFieldError error={fieldErrors.password} />
      </div>

      <div>
        <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Confirm Password *
        </label>
        <input
          id="password2"
          name="password2"
          type="password"
          required
          value={formData.password2}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            fieldErrors.password2 ? 'border-red-300 ring-red-100' : 'border-gray-300'
          }`}
          placeholder="Confirm your password"
        />
        {formData.password2 && formData.password === formData.password2 && (
          <div className="flex items-center mt-2 text-green-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Passwords match
          </div>
        )}
        <FormFieldError error={fieldErrors.password2} />
      </div>
    </div>
  );

  const renderProfessionalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
        <p className="text-sm text-gray-600">Tell us about your role and organization</p>
      </div>

      <div>
        <label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
          Role *
        </label>
        <select
          id="user_type"
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="project_manager">Project Manager</option>
          <option value="site_engineer">Site Engineer</option>
          <option value="contractor">Contractor</option>
          <option value="foreman">Foreman</option>
          <option value="worker">Worker</option>
          <option value="client">Client</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          value={formData.organization}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter your organization name"
        />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
          <svg className="inline w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          Position
        </label>
        <input
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter your position/title"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">UjenziIQ</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Create Your Account</h2>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                </div>
              </div>
            )}

            {/* Step Content */}
            {currentStep === 1 && renderPersonalInfoStep()}
            {currentStep === 2 && renderAccountSetupStep()}
            {currentStep === 3 && renderProfessionalInfoStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
