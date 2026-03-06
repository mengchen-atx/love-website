'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      // Use replace so user won't return to protected page via back button.
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-7">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* 左侧 Logo/名称 */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              PM Love
            </h1>
          </div>

          {/* 右侧文字和退出按钮 */}
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden sm:inline text-xs md:text-sm text-gray-600 hover:text-pink-500 transition-colors cursor-default">
              喜欢花
            </span>
            <span className="hidden sm:inline text-xs md:text-sm text-gray-600 hover:text-purple-500 transition-colors cursor-default">
              喜欢浪漫
            </span>
            <span className="hidden md:inline text-xs md:text-sm text-gray-600 hover:text-blue-500 transition-colors cursor-default">
              喜欢你～
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
