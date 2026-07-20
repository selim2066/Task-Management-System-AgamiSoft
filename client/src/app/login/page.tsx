'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/errorHandler';
import { Loader2, Mail, Lock, LayoutDashboard, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const validate = () => {
    const errors: {email?: string, password?: string} = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('Logged in successfully.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Panel - Brand/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500 mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">TMS</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-blue-200 text-sm font-semibold mb-6">
            New Version 2.0
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            Manage your tasks with clarity and focus.
          </h1>
          <p className="text-lg text-blue-100/80 mb-10 leading-relaxed font-medium">
            Join thousands of professionals who use TMS to organize their work, collaborate seamlessly, and achieve their goals faster.
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-gradient-to-br from-blue-100 to-indigo-200 shadow-sm flex items-center justify-center text-xs font-bold text-indigo-800">
                  U{i}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-blue-200">Trusted by 10k+ professionals</span>
          </div>
        </div>
        
        <div className="relative z-10 text-sm font-medium text-blue-300/60">
          &copy; {new Date().getFullYear()} Agami Soft Task Management. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-md">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">TMS</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left mt-12 lg:mt-0">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                  <Mail className={`h-5 w-5 ${validationErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setValidationErrors({ ...validationErrors, email: '' }); }}
                  className={`block w-full pl-11 pr-4 py-3 sm:text-sm border rounded-xl transition-all duration-200 outline-none
                    ${validationErrors.email 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' 
                      : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50 hover:bg-white focus:bg-white'}
                  `}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{validationErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 block">Password</label>
                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                  <Lock className={`h-5 w-5 ${validationErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setValidationErrors({ ...validationErrors, password: '' }); }}
                  className={`block w-full pl-11 pr-11 py-3 sm:text-sm border rounded-xl transition-all duration-200 outline-none
                    ${validationErrors.password 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' 
                      : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50 hover:bg-white focus:bg-white'}
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.password && <p className="text-red-500 text-sm mt-1.5 font-medium">{validationErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(validationErrors).some(k => (validationErrors as any)[k])}
              className="group w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold">Or try a demo account</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@example.com');
                  setPassword('Admin123!');
                  setValidationErrors({});
                }}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 active:scale-[0.98]"
              >
                Demo Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('User123!');
                  setValidationErrors({});
                }}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 active:scale-[0.98]"
              >
                Demo User
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600 font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
