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
      <div className="container mx-auto max-w-5xl px-4 py-6">
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Plus className="h-4 w-4" /> 添加时间点
            </button>
          </div>
        </div>

        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">关于我们</h1>
          <p className="text-base text-gray-600">我们的经历</p>
        </div>

        {/* 简介卡片 */}
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 shadow-2xl md:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="mx-auto mb-5 h-12 w-12 animate-pulse-slow fill-red-500 text-red-500" />
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Mao & Pi 的爱情故事</h2>
            <p className="mb-3 text-base leading-relaxed text-gray-700">两个人，从陌生到熟悉，从朋友到恋人。</p>
            <p className="text-base leading-relaxed text-gray-700">
              我们用这个网站记录彼此的点点滴滴，见证我们的爱情成长。
              每一张照片、每一段文字、每一个约定，都是我们爱情的印记。
            </p>
          </div>
        </div>

        {/* 时间轴 */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">我们的重要时刻</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-gray-400">还没有时间线，添加你们的第一个重要时刻吧 💕</div>
          ) : (
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 hidden md:block"></div>

              <div className="space-y-10">
                {milestones.map((milestone, index) => {
                  const isLeft = index % 2 === 0; // 左侧显示（内容右对齐靠近轴）
                  return (
                  <div key={milestone.id}
                    className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-6`}>
                    
                    {/* 内容区域 */}
                    <div className={`flex-1 ${isLeft ? 'md:flex md:justify-end' : 'md:flex md:justify-start'} flex justify-center`}>
                      {editingId === milestone.id ? (
                        /* 编辑模式 */
                        <div className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5 shadow-lg">
                          <input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} placeholder="标题"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="描述..." rows={3}
                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">取消</button>
                            <button onClick={handleEdit} className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600">保存</button>
                          </div>
                        </div>
                      ) : (
                        /* 显示模式 */
                        <div className={`${isLeft ? 'md:text-right' : 'md:text-left'} text-center group relative`}>
                          <p className="mb-1.5 text-xs text-gray-500">{milestone.date}</p>
                          <h3 className="mb-1.5 text-xl font-bold text-gray-800">{milestone.title}</h3>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-400 mt-2">by {milestone.author}</p>
                          {/* 操作按钮 */}
                          <div className={`opacity-0 group-hover:opacity-100 transition-all flex gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'} justify-center mt-3`}>
                            <button onClick={() => startEdit(milestone)} className="rounded-full bg-white p-2 text-blue-500 shadow-md transition-colors hover:text-blue-700">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(milestone.id)} className="rounded-full bg-white p-2 text-red-400 shadow-md transition-colors hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 中间图标 */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg">
                        <Heart className="h-7 w-7 text-white" />
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
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <h3 className="mb-1.5 text-lg font-bold text-gray-800">Mao</h3>
            <p className="text-sm text-gray-600">喜欢浪漫，喜欢记录生活，喜欢和你在一起的每一天。</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="mb-1.5 text-lg font-bold text-gray-800">Pi</h3>
            <p className="text-sm text-gray-600">喜欢花，喜欢你的陪伴，珍惜我们在一起的每个瞬间。</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Heart className="w-6 h-6 fill-gray-400" />
            <p className="text-sm">愿我们的爱情，如同这个网站，永远美好</p>
            <Heart className="w-6 h-6 fill-gray-400" />
          </div>
        </div>

        {/* 添加时间点弹窗 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="w-full max-w-lg rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="mb-5 text-xl font-bold text-gray-800">添加新的时间点</h2>
              <div className="space-y-4">
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="text" placeholder="标题 - 比如：第一次约会" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <textarea placeholder="写一些关于这个时刻的回忆..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={4} className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setShowAddForm(false)} className="flex-1 rounded-xl border border-gray-300 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">取消</button>
                <button onClick={handleAdd} className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm text-white transition-all hover:shadow-lg">添加</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
