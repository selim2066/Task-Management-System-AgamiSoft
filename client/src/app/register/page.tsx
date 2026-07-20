'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/errorHandler';
import { Loader2, Mail, Lock, User, LayoutDashboard, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{name?: string, email?: string, password?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const validate = () => {
    const errors: {name?: string, email?: string, password?: string} = {};
    if (!name.trim() || name.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      showToast('Registration successful! Please log in.', 'success');
      router.push('/login');
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Panel - Brand/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-800 via-purple-900 to-indigo-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '9s' }}></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500 mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">TMS</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            Start your journey to better productivity.
          </h1>
          <p className="text-lg text-indigo-100/80 mb-10 leading-relaxed font-medium">
            Create an account in seconds and join a community dedicated to achieving more with less stress.
          </p>
          
          <div className="space-y-4">
            {['Collaborate with your team seamlessly', 'Track progress in real-time', 'Enterprise-grade security'].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                </div>
                <span className="text-indigo-100 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-sm font-medium text-indigo-300/60">
          &copy; {new Date().getFullYear()} Agami Soft Task Management. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-md">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">TMS</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left mt-12 lg:mt-0">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create an account</h2>
            <p className="text-gray-500 font-medium">Enter your details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Full name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                  <User className={`h-5 w-5 ${validationErrors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setValidationErrors({ ...validationErrors, name: '' }); }}
                  className={`block w-full pl-11 pr-4 py-3 sm:text-sm border rounded-xl transition-all duration-200 outline-none
                    ${validationErrors.name 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' 
                      : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 bg-gray-50 hover:bg-white focus:bg-white'}
                  `}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors.name && <p className="text-red-500 text-sm mt-1.5 font-medium">{validationErrors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                  <Mail className={`h-5 w-5 ${validationErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setValidationErrors({ ...validationErrors, email: '' }); }}
                  className={`block w-full pl-11 pr-4 py-3 sm:text-sm border rounded-xl transition-all duration-200 outline-none
                    ${validationErrors.email 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' 
                      : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 bg-gray-50 hover:bg-white focus:bg-white'}
                  `}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{validationErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                  <Lock className={`h-5 w-5 ${validationErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setValidationErrors({ ...validationErrors, password: '' }); }}
                  className={`block w-full pl-11 pr-11 py-3 sm:text-sm border rounded-xl transition-all duration-200 outline-none
                    ${validationErrors.password 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' 
                      : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 bg-gray-50 hover:bg-white focus:bg-white'}
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
              className="group w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
