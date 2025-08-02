'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleMyEvents = () => {
    router.push('/my-events');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <h1
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700"
              onClick={handleHome}
            >
              Event Management System
            </h1>

            <nav className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleHome}
                className="cursor-pointer"
              >
                All Events
              </Button>
              {status === 'authenticated' && session && (<Button
                variant="ghost"
                onClick={handleMyEvents}
                className="cursor-pointer"
              >
                My Events
              </Button>)}
            </nav>

          </div>

          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : status === 'authenticated' && session ? (
              <Button className="cursor-pointer" onClick={handleLogout} variant="outline">
                Logout
              </Button>
            ) : (
              <Button className="cursor-pointer" onClick={handleLogin} variant="default">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 