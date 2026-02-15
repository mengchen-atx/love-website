'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DebugPage() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        console.log('Supabase not configured');
        setLoading(false);
        return;
      }

      try {
        // 获取当前 session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session:', session);
        console.log('Session error:', sessionError);
        setSession(session);

        // 获取当前用户
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User:', user);
        console.log('User error:', userError);
        setUser(user);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">调试信息</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">加载状态：</h2>
            <p>{loading ? '加载中...' : '已加载'}</p>
          </div>

          <div>
            <h2 className="font-semibold">Supabase 配置：</h2>
            <p>{supabase ? '✅ 已配置' : '❌ 未配置'}</p>
          </div>

          <div>
            <h2 className="font-semibold">用户登录状态：</h2>
            {user ? (
              <div className="bg-green-50 p-4 rounded">
                <p className="text-green-800">✅ 已登录</p>
                <p className="text-sm mt-2">邮箱: {user.email}</p>
                <p className="text-sm">ID: {user.id}</p>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded">
                <p className="text-red-800">❌ 未登录</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold">Session 信息：</h2>
            {session ? (
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-blue-800">✅ Session 存在</p>
                <p className="text-sm mt-2">过期时间: {new Date(session.expires_at * 1000).toLocaleString()}</p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded">
                <p className="text-yellow-800">⚠️ 无 Session</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-2">
            <Link href="/login" className="block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              去登录
            </Link>
            <Link href="/" className="block text-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              去首页
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">完整数据（开发者查看）：</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({ user, session }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
