'use client';

import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  
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
            <div className="flex items-center space-x-1">
              <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-1.5 bg-[#FFC900] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <LayoutDashboard className="h-5 w-5 text-black stroke-[3]" />
                <span className="text-lg font-black uppercase tracking-widest">TMS_</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5">
                <User className="h-4 w-4 text-black stroke-[3]" />
                <span className="text-sm font-bold uppercase">{user?.name} <span className="bg-[#00E5FF] px-1 ml-1 border border-black font-black">{user?.role}</span></span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm text-black bg-[#FF90E8] px-3 py-1.5 border-2 border-black font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4 stroke-[3]" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
