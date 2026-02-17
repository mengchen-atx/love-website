'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthContext';
import { supabase } from '@/lib/supabase';

/**
 * 根据登录邮箱自动判断当前用户是 Mao 还是 Pi
 * 优先从 AuthContext 获取 email（由 AuthGuard 提供），避免重复调用 getSession()
 */
export function useCurrentUser() {
  const { userEmail } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCurrentUser('Mao');
      setLoading(false);
      return;
    }

    // 如果 AuthContext 已提供 email，直接使用，无需再调 getSession()
    if (userEmail) {
      const maoEmail = process.env.NEXT_PUBLIC_MAO_EMAIL || '';
      setCurrentUser(userEmail === maoEmail ? 'Mao' : 'Pi');
      setLoading(false);
      return;
    }

    // 回退：如果 context 中没有 email（如登录页），则手动获取
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const maoEmail = process.env.NEXT_PUBLIC_MAO_EMAIL || '';
        setCurrentUser(session.user.email === maoEmail ? 'Mao' : 'Pi');
      } else {
        setCurrentUser('Mao');
      }
      setLoading(false);
    };

    getUser();
  }, [userEmail]);

  return { currentUser, loading };
}
