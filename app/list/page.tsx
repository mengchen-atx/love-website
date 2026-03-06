'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, X, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  created_by: string;
}

export default function ListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useCurrentUser();
  const [newTodo, setNewTodo] = useState({ title: '', priority: 'medium' });

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (data) setTodos(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newTodo.title.trim() || !supabase || !currentUser) return;
    const { data } = await supabase.from('todos')
      .insert([{ title: newTodo.title, priority: newTodo.priority, created_by: currentUser, completed: false }])
      .select().single();
    if (data) {
      setTodos([data, ...todos]);
      setNewTodo({ title: '', priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || !supabase) return;
    const { error } = await supabase.from('todos').update({ completed: !todo.completed }).eq('id', id);
    if (!error) setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) setTodos(todos.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-700 border-red-200';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };
  const getPriorityLabel = (p: string) => p === 'high' ? '重要' : p === 'medium' ? '一般' : '不急';

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 返回首页
          </Link>
          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs text-gray-600 shadow-sm">
                当前身份：<span className="font-semibold text-pink-600">{currentUser}</span>
              </span>
            )}
            <button onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Plus className="h-4 w-4" /> 添加新约定
            </button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <Heart className="h-8 w-8 fill-pink-600 text-pink-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">Love List</h1>
          <p className="text-base text-gray-600">恋爱列表 - 你我之间的约定</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-3 text-center shadow-md">
            <p className="text-2xl font-bold text-gray-800">{todos.length}</p>
            <p className="text-xs text-gray-500">总计</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-3 text-center shadow-md">
            <p className="text-2xl font-bold text-green-600">{todos.filter(t => t.completed).length}</p>
            <p className="text-xs text-gray-600">已完成</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-3 text-center shadow-md">
            <p className="text-2xl font-bold text-pink-600">{todos.filter(t => !t.completed).length}</p>
            <p className="text-xs text-gray-600">进行中</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">还没有约定，添加你们的第一个吧 💕</div>
        ) : (
          <div className="space-y-2.5">
            {todos.map((todo) => (
              <div key={todo.id} className={`rounded-2xl bg-white p-3.5 shadow-md transition-all duration-300 hover:shadow-lg ${todo.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleComplete(todo.id)}
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-pink-500'}`}>
                    {todo.completed && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-base ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(todo.priority)}`}>{getPriorityLabel(todo.priority)}</span>
                      <span className="text-xs text-gray-400">by {todo.created_by}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteTodo(todo.id)} className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="w-full max-w-lg rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="mb-5 text-xl font-bold text-gray-800">添加新约定</h2>
              <div className="space-y-4">
                <input type="text" placeholder="我们约定..." value={newTodo.title} onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <select value={newTodo.priority} onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option value="low">不急</option><option value="medium">一般</option><option value="high">重要</option>
                </select>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setShowAddForm(false)} className="flex-1 rounded-xl border border-gray-300 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">取消</button>
                <button onClick={handleAdd} className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm text-white transition-all hover:shadow-lg">添加</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
