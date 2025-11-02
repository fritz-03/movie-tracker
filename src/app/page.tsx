'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Movie Tracker
        </h1>
        <p className="text-gray-600 mb-8">
          Track your favorite movies and build your personal collection.
        </p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-lg font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md text-lg font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
