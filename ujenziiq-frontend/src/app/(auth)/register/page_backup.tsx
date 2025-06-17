'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
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
  };  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Medium";
    return "Strong";
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
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
      if (!formData.phone_number.trim()) {
        newFieldErrors.phone_number = "Phone number is required";
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
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});
    
    // Client-side validation
    const newFieldErrors: Record<string, string> = {};
    let hasErrors = false;
    
    if (!formData.username.trim()) {
      newFieldErrors.username = "Username is required";
      hasErrors = true;
    }
      if (!formData.email.trim()) {
      newFieldErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = "Email is invalid";
      hasErrors = true;
    }
    
    if (!formData.first_name.trim()) {
      newFieldErrors.first_name = "First name is required";
      hasErrors = true;
    }
    
    if (!formData.last_name.trim()) {
      newFieldErrors.last_name = "Last name is required";
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
    
    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }    try {
      console.log("Submitting registration data:", { ...formData, password: "***", password2: "***" });
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/');
      await register(formData);
      console.log("Registration successful, redirecting to dashboard");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      console.error("Error type:", typeof err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      
      if (typeof err === 'object' && err !== null && 'response' in err && 
          typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
        // Format Django validation errors
        const serverErrors = err.response.data as Record<string, string[]>;
        const newFieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        console.log("Server validation errors:", serverErrors);
        
        // Map server errors to field errors
        for (const field in serverErrors) {
          const errorMessage = serverErrors[field].join(" ");
          
          // Handle field-specific errors
          if (field in formData) {
            newFieldErrors[field] = errorMessage;
          } else {
            // Handle non-field errors
            generalErrors.push(`${field}: ${errorMessage}`);
          }
        }
        
        setFieldErrors(newFieldErrors);
        
        if (generalErrors.length > 0) {
          setError(generalErrors.join("\n"));
        }
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        // Handle network errors
        setError(`Network error: ${(err as Error).message}`);
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-blue-600">UjenziIQ</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">              <div className="sm:col-span-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm ${
                    fieldErrors.username ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <FormFieldError error={fieldErrors.username} />
              </div>              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm ${
                    fieldErrors.first_name ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <FormFieldError error={fieldErrors.first_name} />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm ${
                    fieldErrors.last_name ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <FormFieldError error={fieldErrors.last_name} />
              </div><div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm ${
                    fieldErrors.email ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <FormFieldError error={fieldErrors.email} />
              </div>              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm ${
                    fieldErrors.password ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <FormFieldError error={fieldErrors.password} />
              </div>

              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm ${
                    fieldErrors.password2 ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <FormFieldError error={fieldErrors.password2} />
              </div>

              <div>
                <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="user_type"
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
