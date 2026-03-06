'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Moment {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

function MomentCard({ moment, onDelete }: { moment: Moment; onDelete: (id: string) => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      // line-height ~1.75rem (leading-relaxed), 8 lines ≈ 14rem
      const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 28;
      const maxHeight = lineHeight * 8;
      if (contentRef.current.scrollHeight > maxHeight + 4) {
        setIsLong(true);
      }
    }
  }, [moment.content]);

  return (
    <div className="relative pl-14">
      <div className="absolute left-4 top-4 h-3.5 w-3.5 rounded-full border-2 border-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"></div>
      <div className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-lg font-bold text-gray-800">{moment.title}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{moment.date}</span>
              <span className="rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-2.5 py-1 text-xs font-medium text-pink-700">{moment.author}</span>
            </div>
          </div>
          <button onClick={() => onDelete(moment.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <div ref={contentRef}
            className={`overflow-hidden break-words text-xs leading-relaxed text-gray-600 transition-all duration-300 ${
              isLong && !expanded ? 'max-h-[14rem]' : ''
            }`}
            style={isLong && !expanded ? { WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' } : undefined}>
            {moment.content}
          </div>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-purple-500 transition-colors hover:text-purple-700">
              {expanded ? (<><ChevronUp className="h-3.5 w-3.5" />收起</>) : (<><ChevronDown className="h-3.5 w-3.5" />展开全文</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useCurrentUser();
  const [newMoment, setNewMoment] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchMoments(); }, []);

  const fetchMoments = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('moments').select('*').order('date', { ascending: false });
    if (data) setMoments(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newMoment.title || !newMoment.content || !supabase || !currentUser) return;
    const { data } = await supabase.from('moments')
      .insert([{ ...newMoment, author: currentUser }]).select().single();
    if (data) {
      setMoments([data, ...moments]);
      setNewMoment({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？') || !supabase) return;
    const { error } = await supabase.from('moments').delete().eq('id', id);
    if (!error) setMoments(moments.filter(m => m.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex items-center justify-between">
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
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-xs text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Plus className="h-4 w-4" /> 写新记录
            </button>
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Calendar className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="mb-1.5 text-2xl font-bold text-gray-800 md:text-3xl">点点滴滴</h1>
          <p className="text-sm text-gray-600">记录你我生活的美好瞬间</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : moments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">还没有记录，写下你们的第一个故事吧 💕</div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300"></div>
            <div className="space-y-5">
              {moments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="w-full max-w-2xl rounded-3xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
              <h2 className="mb-4 text-lg font-bold text-gray-800">写新记录</h2>
              <div className="space-y-4">
                <input type="text" placeholder="标题" value={newMoment.title} onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="date" value={newMoment.date} onChange={(e) => setNewMoment({...newMoment, date: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <textarea placeholder="记录这一刻的美好..." value={newMoment.content} onChange={(e) => setNewMoment({...newMoment, content: e.target.value})}
                  rows={4} className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setShowAddForm(false)} className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-50">取消</button>
                <button onClick={handleAdd} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-xs text-white transition-all hover:shadow-lg">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
