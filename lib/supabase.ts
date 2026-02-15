// Supabase 客户端配置
// 使用说明：
// 1. 访问 https://supabase.com 创建免费账号
// 2. 创建新项目
// 3. 在项目设置中获取 URL 和 ANON KEY
// 4. 将这些值添加到 .env.local 文件中

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 创建 Supabase 客户端（如果未配置则使用空客户端）
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// 数据库类型定义（待完善）
export interface Photo {
  id: string;
  url: string;
  title?: string;
  description?: string;
  taken_at: string;
  uploaded_by: string;
  created_at: string;
}

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_by: string;
  created_at: string;
  completed_at?: string;
}

// 工具函数
export const uploadPhoto = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getPhotoUrl = (path: string) => {
  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(path);

  return data.publicUrl;
};

// 认证相关（待实现）
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
