'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Heart, Calendar, Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  author: string;
}

export default function AboutPage() {
  const [milestones, setMilestones] = useState<TimelineItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useCurrentUser();
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], title: '', description: '' });
  const [editForm, setEditForm] = useState({ date: '', title: '', description: '' });

  useEffect(() => { fetchTimeline(); }, []);

  const fetchTimeline = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('timeline').select('*').order('date', { ascending: true });
    if (data) setMilestones(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.title || !form.date || !supabase || !currentUser) return;
    const { data } = await supabase.from('timeline')
      .insert([{ ...form, author: currentUser }]).select().single();
    if (data) {
      setMilestones([...milestones, data].sort((a, b) => a.date.localeCompare(b.date)));
      setForm({ date: new Date().toISOString().split('T')[0], title: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个时间点吗？') || !supabase) return;
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (!error) setMilestones(milestones.filter(m => m.id !== id));
  };

  const startEdit = (item: TimelineItem) => {
    setEditingId(item.id);
    setEditForm({ date: item.date, title: item.title, description: item.description || '' });
  };

  const handleEdit = async () => {
    if (!editingId || !editForm.title || !supabase) return;
    const { error } = await supabase.from('timeline')
      .update({ date: editForm.date, title: editForm.title, description: editForm.description })
      .eq('id', editingId);
    if (!error) {
      setMilestones(milestones.map(m => m.id === editingId ? { ...m, ...editForm } : m)
        .sort((a, b) => a.date.localeCompare(b.date)));
      setEditingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> 返回首页
          </Link>
          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                当前身份：<span className="font-semibold text-pink-600">{currentUser}</span>
              </span>
            )}
            <button onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Plus className="w-5 h-5" /> 添加时间点
            </button>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Users className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">关于我们</h1>
          <p className="text-xl text-gray-600">我们的经历</p>
        </div>

        {/* 简介卡片 */}
        <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Mao & Pi 的爱情故事</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">两个人，从陌生到熟悉，从朋友到恋人。</p>
            <p className="text-lg text-gray-700 leading-relaxed">
              我们用这个网站记录彼此的点点滴滴，见证我们的爱情成长。
              每一张照片、每一段文字、每一个约定，都是我们爱情的印记。
            </p>
          </div>
        </div>

        {/* 时间轴 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">我们的重要时刻</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-gray-400">还没有时间线，添加你们的第一个重要时刻吧 💕</div>
          ) : (
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 hidden md:block"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const isLeft = index % 2 === 0; // 左侧显示（内容右对齐靠近轴）
                  return (
                  <div key={milestone.id}
                    className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8`}>
                    
                    {/* 内容区域 */}
                    <div className={`flex-1 ${isLeft ? 'md:flex md:justify-end' : 'md:flex md:justify-start'} flex justify-center`}>
                      {editingId === milestone.id ? (
                        /* 编辑模式 */
                        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-3 w-full max-w-sm">
                          <input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} placeholder="标题"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="描述..." rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">取消</button>
                            <button onClick={handleEdit} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm">保存</button>
                          </div>
                        </div>
                      ) : (
                        /* 显示模式 */
                        <div className={`${isLeft ? 'md:text-right' : 'md:text-left'} text-center group relative`}>
                          <p className="text-sm text-gray-500 mb-2">{milestone.date}</p>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-400 mt-2">by {milestone.author}</p>
                          {/* 操作按钮 */}
                          <div className={`opacity-0 group-hover:opacity-100 transition-all flex gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'} justify-center mt-3`}>
                            <button onClick={() => startEdit(milestone)} className="p-2 bg-white rounded-full shadow-md text-blue-500 hover:text-blue-700 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(milestone.id)} className="p-2 bg-white rounded-full shadow-md text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 中间图标 */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* 占位区域 */}
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 底部卡片 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mao</h3>
            <p className="text-gray-600">喜欢浪漫，喜欢记录生活，喜欢和你在一起的每一天。</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pi</h3>
            <p className="text-gray-600">喜欢花，喜欢你的陪伴，珍惜我们在一起的每个瞬间。</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Heart className="w-6 h-6 fill-gray-400" />
            <p className="text-sm">愿我们的爱情，如同这个网站，永远美好</p>
            <Heart className="w-6 h-6 fill-gray-400" />
          </div>
        </div>

        {/* 添加时间点弹窗 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="bg-white rounded-3xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">添加新的时间点</h2>
              <div className="space-y-4">
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white" />
                <input type="text" placeholder="标题 - 比如：第一次约会" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white" />
                <textarea placeholder="写一些关于这个时刻的回忆..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900 bg-white" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowAddForm(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">取消</button>
                <button onClick={handleAdd} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all">添加</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
