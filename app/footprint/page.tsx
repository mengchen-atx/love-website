'use client';

import dynamic from 'next/dynamic';
import { Heart } from 'lucide-react';

const FootprintContent = dynamic(() => import('@/components/FootprintContent'), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Heart className="mx-auto mb-2.5 h-10 w-10 animate-pulse fill-pink-500 text-pink-500" />
        <p className="text-xs text-gray-600">加载地图中...</p>
      </div>
    </main>
  ),
});

export default function FootprintPage() {
  return <FootprintContent />;
}
