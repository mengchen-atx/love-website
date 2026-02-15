'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // 如果 Supabase 未配置，直接放行
    if (!supabase) {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setAuthenticated(true);
        // 如果在登录页但已登录，跳转到首页
        if (pathname === '/login') {
          router.push('/');
        }
      } else {
        setAuthenticated(false);
        // 如果不在登录页且未登录，跳转到登录页
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
      setLoading(false);
    };

    checkAuth();

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        if (session) {
          setAuthenticated(true);
          if (pathname === '/login') {
            router.push('/');
          }
        } else {
          setAuthenticated(false);
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  // 加载中显示 loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-500 fill-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 在登录页直接显示
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // 未登录不显示内容
  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
