'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldError } from "@/components/forms/FormFieldError";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Building2, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Users,
  BarChart3
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    // Client-side validation
    const newFieldErrors: Record<string, string> = {};
    let hasErrors = false;
    
    if (!email.trim()) {
      newFieldErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = "Email is invalid";
      hasErrors = true;
    }
    
    if (!password) {
      newFieldErrors.password = "Password is required";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      
      if (typeof err === 'object' && err !== null && 'response' in err && 
          typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
        
        // Format Django validation errors
        const serverErrors = err.response.data as Record<string, string[] | string>;
        const newFieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        console.log("Server validation errors:", serverErrors);
        
        // Map server errors to field errors
        for (const field in serverErrors) {
          let errorMessage: string;
          
          if (Array.isArray(serverErrors[field])) {
            errorMessage = (serverErrors[field] as string[]).join(" ");
          } else {
            errorMessage = serverErrors[field] as string;
          }
          
          // Handle field-specific errors
          if (field === 'email' || field === 'password') {
            newFieldErrors[field] = errorMessage;
          } else if (field === 'detail') {
            // Common Djoser error field for authentication issues
            generalErrors.push(errorMessage);
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
        setError("Failed to login. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col lg:flex-row">
      {/* Left Side - Branding & Features */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-12"></div>
          <div className="absolute top-32 right-16 w-16 h-16 border-2 border-white/20 rounded-lg -rotate-12"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 border-2 border-white/20 rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 border-2 border-white/20 rounded-lg -rotate-45"></div>
        </div>
        
        <div className="relative z-10">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">UjenziIQ</h1>
              <p className="text-blue-100 text-sm">Construction Management</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Welcome Back to
              <span className="block text-blue-200">Your Projects</span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Manage construction projects, track progress, and ensure safety compliance with ease.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-blue-100 text-sm">Real-time communication and task management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-blue-100 text-sm">Monitor project milestones and deadlines</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Safety Compliance</h3>
                <p className="text-blue-100 text-sm">Incident reporting and safety protocols</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-blue-100 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-blue-100 text-sm">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-blue-100 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Form Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Sign in failed</p>
                <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    fieldErrors.email 
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              <FormFieldError error={fieldErrors.email} />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    fieldErrors.password 
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <FormFieldError error={fieldErrors.password} />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <ArrowRight className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors" />
                )}
              </span>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to ConTech?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Create a new account
              </Link>
            </div>
          </form>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
