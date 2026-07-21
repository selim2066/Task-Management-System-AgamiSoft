'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-black selection:bg-[#00E5FF] selection:text-black"
      style={{
        backgroundColor: '#FFFDF9',
        backgroundImage: 'radial-gradient(#D1D5DB 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Top Navbar */}
      <nav className="bg-white border-b-4 border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 px-3 py-1.5 bg-[#FFC900] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <LayoutDashboard className="h-5 w-5 text-black stroke-[3]" />
              <span className="text-lg font-black uppercase tracking-widest">TMS_</span>
            </Link>

            <div className="hidden sm:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5">
                    <User className="h-4 w-4 text-black stroke-[3]" />
                    <span className="text-sm font-bold uppercase">{user?.name} <span className="bg-[#00E5FF] px-1 ml-1 border border-black font-black">{user?.role}</span></span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-sm text-black bg-[#00E5FF] px-4 py-2 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4 stroke-[3]" />
                    <span>DASHBOARD</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-sm text-black bg-[#FF90E8] px-3 py-1.5 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4 stroke-[3]" />
                    <span>LOGOUT</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-black bg-white px-4 py-2 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm text-black bg-[#00E5FF] px-4 py-2 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    GET STARTED
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="sm:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border-2 border-black bg-[#FFEA00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 stroke-[3]" /> : <Menu className="h-6 w-6 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t-4 border-black bg-white p-4 flex flex-col space-y-4">
            {user ? (
              <>
                <div className="flex justify-center items-center space-x-2 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-2">
                  <User className="h-4 w-4 text-black stroke-[3]" />
                  <span className="text-sm font-bold uppercase">{user?.name} <span className="bg-[#00E5FF] px-1 ml-1 border border-black font-black">{user?.role}</span></span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center space-x-2 text-sm text-black bg-[#00E5FF] px-4 py-3 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  <LayoutDashboard className="h-4 w-4 stroke-[3]" />
                  <span>DASHBOARD</span>
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex justify-center items-center space-x-2 text-sm text-black bg-[#FF90E8] px-4 py-3 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  <LogOut className="h-4 w-4 stroke-[3]" />
                  <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm text-black bg-white px-4 py-3 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm text-black bg-[#00E5FF] px-4 py-3 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  GET STARTED
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* Hero Card */}
        <section className="bg-[#FFF9C4] border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="inline-block bg-[#FF90E8] text-black font-black text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider mb-6">
            TASK MANAGEMENT SYSTEM v2.0
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-tight leading-none mb-6">
            ORGANIZE PROJECTS &amp; DELIVER TASKS <span className="bg-[#00E5FF] px-2 border-2 border-black inline-block mt-2">WITHOUT CHAOS.</span>
          </h1>
          
          <p className="text-lg sm:text-xl font-bold text-gray-800 max-w-3xl leading-relaxed mb-8 uppercase">
            A high-performance full-stack task management platform built with Next.js &amp; Express. Role-based access control, real-time debounced task filtering, and clean project boards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#7C4DFF] text-white font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase"
            >
              <span>{user ? 'OPEN DASHBOARD' : 'GET STARTED FOR FREE'}</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </Link>
            
            {!user && (
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase"
              >
                <span>SIGN IN WITH DEMO ACCOUNT</span>
              </Link>
            )}
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="mt-8 bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
            <div className="text-xs font-black uppercase text-black mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00E5FF] border border-black animate-ping"></span>
              QUICK SEEDED DEMO CREDENTIALS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-black font-mono">
              <div className="bg-[#F5F5F5] border border-black p-2">
                <span className="bg-[#FFEA00] px-1 border border-black font-black mr-1">ADMIN</span>
                admin@example.com / Admin123!
              </div>
              <div className="bg-[#F5F5F5] border border-black p-2">
                <span className="bg-[#00E5FF] px-1 border border-black font-black mr-1">USER</span>
                user@example.com / User123!
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#00E5FF] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-12 w-12 bg-white border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-7 h-7 text-black stroke-[3]" />
            </div>
            <h3 className="text-xl font-black uppercase text-black mb-2">ROLE-BASED RBAC</h3>
            <p className="font-bold text-sm text-black uppercase leading-relaxed">
              Standard users manage private workspaces. Administrators gain full oversight of all system-wide projects and tasks.
            </p>
          </div>

          <div className="bg-[#FF90E8] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-12 w-12 bg-white border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="w-7 h-7 text-black stroke-[3]" />
            </div>
            <h3 className="text-xl font-black uppercase text-black mb-2">DEBOUNCED SEARCH</h3>
            <p className="font-bold text-sm text-black uppercase leading-relaxed">
              Search tasks in real-time with optimized server-side debounced queries and instant status filtering (TODO, IN PROGRESS, DONE).
            </p>
          </div>

          <div className="bg-[#FFEA00] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-12 w-12 bg-white border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-7 h-7 text-black stroke-[3]" />
            </div>
            <h3 className="text-xl font-black uppercase text-black mb-2">PROJECT BOARDS</h3>
            <p className="font-bold text-sm text-black uppercase leading-relaxed">
              Organize tasks cleanly within scoped project boards featuring task counters and user attribution tags.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-sm uppercase bg-[#FFC900] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">TMS_</span>
            <span className="font-bold text-xs uppercase text-gray-700">© {new Date().getFullYear()} AGAMI SOFT TASK MANAGEMENT SYSTEM</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase">
            <Link href="/login" className="hover:underline">SIGN IN</Link>
            <Link href="/register" className="hover:underline">REGISTER</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


