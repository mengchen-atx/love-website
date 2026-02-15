'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, X, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const [newTodo, setNewTodo] = useState({ title: '', priority: 'medium', created_by: 'Mao' });

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (data) setTodos(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newTodo.title.trim() || !supabase) return;
    const { data } = await supabase.from('todos')
      .insert([{ title: newTodo.title, priority: newTodo.priority, created_by: newTodo.created_by, completed: false }])
      .select().single();
    if (data) {
      setTodos([data, ...todos]);
      setNewTodo({ title: '', priority: 'medium', created_by: 'Mao' });
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> 返回首页
          </Link>
          <button onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Plus className="w-5 h-5" /> 添加新约定
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
            <Heart className="w-10 h-10 text-pink-600 fill-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Love List</h1>
          <p className="text-xl text-gray-600">恋爱列表 - 你我之间的约定</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-gray-800">{todos.length}</p>
            <p className="text-sm text-gray-500">总计</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-green-600">{todos.filter(t => t.completed).length}</p>
            <p className="text-sm text-gray-600">已完成</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-pink-600">{todos.filter(t => !t.completed).length}</p>
            <p className="text-sm text-gray-600">进行中</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">还没有约定，添加你们的第一个吧 💕</div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 ${todo.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleComplete(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-pink-500'}`}>
                    {todo.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(todo.priority)}`}>{getPriorityLabel(todo.priority)}</span>
                      <span className="text-xs text-gray-400">by {todo.created_by}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteTodo(todo.id)} className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="bg-white rounded-3xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">添加新约定</h2>
              <div className="space-y-4">
                <input type="text" placeholder="我们约定..." value={newTodo.title} onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newTodo.priority} onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white">
                    <option value="low">不急</option><option value="medium">一般</option><option value="high">重要</option>
                  </select>
                  <select value={newTodo.created_by} onChange={(e) => setNewTodo({...newTodo, created_by: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white">
                    <option value="Mao">Mao</option><option value="Pi">Pi</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowAddForm(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">取消</button>
                <button onClick={handleAdd} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all">添加</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
