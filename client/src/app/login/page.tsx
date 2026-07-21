'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/errorHandler';
import { Loader2, LayoutDashboard, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
      errors.email = 'PLEASE ENTER A VALID EMAIL.';
    }
    if (!password) {
      errors.password = 'PASSWORD IS REQUIRED.';
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
      showToast('LOGGED IN SUCCESSFULLY.', 'success');
      router.push('/dashboard');
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex font-sans text-black selection:bg-[#00E5FF] selection:text-black"
      style={{
        backgroundColor: '#FFFDF9',
        backgroundImage: 'radial-gradient(#D1D5DB 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Left Panel - Brand/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#00E5FF] border-r-4 border-black flex-col justify-between p-12 relative overflow-hidden">
        <Link href="/" className="relative z-10 flex items-center space-x-2 group w-max">
          <div className="bg-[#FFC900] border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <LayoutDashboard className="h-6 w-6 text-black stroke-[3]" />
          </div>
          <span className="text-2xl font-black tracking-widest text-black uppercase bg-white border-2 border-black px-2 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">TMS_</span>
        </Link>
        
        <div className="relative z-10 max-w-lg mt-12 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="inline-block px-3 py-1 bg-[#FF90E8] border-2 border-black text-black text-xs font-black mb-6 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            VERSION 2.0 LIVE
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-6 uppercase text-black">
            MANAGE TASKS WITH <span className="bg-[#FFEA00] px-2 inline-block border-2 border-black mt-2">CLARITY.</span>
          </h1>
          <p className="text-lg font-bold text-gray-800 mb-8 leading-relaxed uppercase">
            Join thousands of professionals who use TMS to organize their work and achieve goals faster.
          </p>
          
          <div className="flex items-center space-x-4 bg-[#F5F5F5] border-2 border-black p-3 w-max">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-[#FFC900] flex items-center justify-center text-xs font-black text-black">
                  U{i}
                </div>
              ))}
            </div>
            <span className="text-xs font-black text-black uppercase">TRUSTED BY 10K+ PROS</span>
          </div>
        </div>
        
        <div className="relative z-10 text-xs font-black text-black uppercase mt-12 bg-white border-2 border-black px-3 py-2 w-max shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          &copy; {new Date().getFullYear()} AGAMI SOFT TMS
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
        {/* Mobile Logo */}
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center space-x-2 group">
          <div className="bg-[#FFC900] border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <LayoutDashboard className="h-5 w-5 text-black stroke-[3]" />
          </div>
          <span className="text-xl font-black tracking-widest text-black uppercase bg-white border-2 border-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">TMS_</span>
        </Link>

        <div className="w-full max-w-md mx-auto bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-12 lg:mt-0">
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-black text-black mb-2 uppercase">WELCOME BACK</h2>
            <p className="text-black font-bold uppercase text-sm bg-[#FFEA00] inline-block px-2 border-2 border-black">SIGN IN TO CONTINUE</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase">
                <span className="bg-white px-1 border border-black">EMAIL ADDRESS</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setValidationErrors({ ...validationErrors, email: '' }); }}
                className={`w-full px-4 py-3 bg-white text-black text-base font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all
                  ${validationErrors.email ? 'bg-red-50 border-red-500' : ''}
                `}
                placeholder="YOU@EXAMPLE.COM"
              />
              {validationErrors.email && (
                <div className="mt-2 bg-red-100 border-2 border-red-500 px-2 py-1 text-red-700 text-xs font-black uppercase inline-block">
                  {validationErrors.email}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-black text-black uppercase">
                  <span className="bg-white px-1 border border-black">PASSWORD</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setValidationErrors({ ...validationErrors, password: '' }); }}
                  className={`w-full pl-4 pr-12 py-3 bg-white text-black text-base font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all
                    ${validationErrors.password ? 'bg-red-50 border-red-500' : ''}
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-black hover:bg-[#F5F5F5] border-l-2 border-black transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 stroke-[3]" /> : <Eye className="h-5 w-5 stroke-[3]" />}
                </button>
              </div>
              {validationErrors.password && (
                <div className="mt-2 bg-red-100 border-2 border-red-500 px-2 py-1 text-red-700 text-xs font-black uppercase inline-block">
                  {validationErrors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || Object.values(validationErrors).some(Boolean)}
              className="w-full flex items-center justify-center py-4 px-4 border-4 border-black text-lg font-black text-black uppercase bg-[#7C4DFF] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#B388FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-6 w-6 stroke-[3]" />
              ) : (
                <>
                  <span className="text-white">SIGN IN</span>
                  <ArrowRight className="ml-2 h-6 w-6 text-white stroke-[3] group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-4 border-black">
            <div className="text-xs font-black text-black uppercase mb-4 text-center">
              <span className="bg-[#00E5FF] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">OR TRY A DEMO ACCOUNT</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@example.com');
                  setPassword('Admin123!');
                  setValidationErrors({});
                }}
                className="w-full flex justify-center py-3 px-2 border-2 border-black bg-[#FFEA00] text-sm font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                DEMO ADMIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('User123!');
                  setValidationErrors({});
                }}
                className="w-full flex justify-center py-3 px-2 border-2 border-black bg-[#FF90E8] text-sm font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                DEMO USER
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm text-black font-black uppercase">
            DON'T HAVE AN ACCOUNT?{' '}
            <Link href="/register" className="text-[#7C4DFF] hover:text-black underline underline-offset-4 decoration-2 transition-colors">
              CREATE ONE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
