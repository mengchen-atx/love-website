'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * 根据登录邮箱自动判断当前用户是 Mao 还是 Pi
 * 需要在 .env.local 和 Vercel 环境变量中设置 NEXT_PUBLIC_MAO_EMAIL
 */
export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        setCurrentUser('Mao');
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const maoEmail = process.env.NEXT_PUBLIC_MAO_EMAIL || '';
        if (session.user.email === maoEmail) {
          setCurrentUser('Mao');
        } else {
          setCurrentUser('Pi');
        }
      } else {
        setCurrentUser('Mao');
      }
      setLoading(false);
    };

    getUser();
  }, []);

  return { currentUser, loading: loading };
}
