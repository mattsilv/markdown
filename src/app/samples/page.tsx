'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SamplesIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the config page
    router.push('/samples/config');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mb-4 h-12 w-12 mx-auto rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
        <p className="text-lg">Redirecting to samples config...</p>
      </div>
    </div>
  );
}