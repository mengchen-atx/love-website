'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnimatedHeart() {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.15 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
      {/* 外层光芒 1 - 扩散圈 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-red-400/20 animate-ping-slow" />
      </div>
      
      {/* 外层光芒 2 - 脉冲圈 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4/5 h-4/5 rounded-full bg-red-400/25 animate-pulse-slow" />
      </div>
      
      {/* 外层光芒 3 - 慢速扩散圈 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/5 h-3/5 rounded-full bg-red-500/30 animate-ping-slower" />
      </div>

      {/* 中心爱心 */}
      <div 
        className="relative z-10 transition-transform duration-1000 ease-in-out"
        style={{ transform: `scale(${pulseScale})` }}
      >
        <div className="relative">
          {/* 主爱心 */}
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-red-500 fill-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          
          {/* 周围的小光点装饰 */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 -left-3 w-2 h-2 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute -top-3 left-1/2 w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute -bottom-1 right-0 w-2 h-2 bg-rose-300 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  );
}
