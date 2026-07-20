'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!token && !localStorage.getItem('tm_token')) {
      router.push('/login');
    }
  }, [token, router]);

  if (!isMounted) return null;

  if (!user && !localStorage.getItem('tm_user')) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
