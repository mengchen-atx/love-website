'use client';

import dynamic from 'next/dynamic';
import { Heart } from 'lucide-react';

const FootprintContent = dynamic(() => import('@/components/FootprintContent'), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-16 h-16 text-pink-500 fill-pink-500 animate-pulse mx-auto mb-4" />
        <p className="text-gray-600">加载地图中...</p>
      </div>
    </main>
  ),
});

export default function FootprintPage() {
  return <FootprintContent />;
}
