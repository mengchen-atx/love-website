import DebugChinaMap from '@/debug-china-map';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DebugMapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href="/footprint" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Footprint
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">China Map Debug Page</h1>
        <p className="text-gray-600 mb-8">
          This page helps diagnose issues with the China map rendering. 
          Check the browser console (F12) for detailed logs.
        </p>
        
        <DebugChinaMap />
      </div>
    </main>
  );
}
