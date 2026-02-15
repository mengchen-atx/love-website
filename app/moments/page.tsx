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
    <div className="relative pl-20">
      <div className="absolute left-6 top-6 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-4 border-white shadow-lg"></div>
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{moment.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{moment.date}</span>
              <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-xs font-medium">{moment.author}</span>
            </div>
          </div>
          <button onClick={() => onDelete(moment.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <div ref={contentRef}
            className={`text-gray-600 leading-relaxed break-words overflow-hidden transition-all duration-300 ${
              isLong && !expanded ? 'max-h-[14rem]' : ''
            }`}
            style={isLong && !expanded ? { WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' } : undefined}>
            {moment.content}
          </div>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)}
              className="mt-2 inline-flex items-center gap-1 text-sm text-purple-500 hover:text-purple-700 transition-colors font-medium">
              {expanded ? (<><ChevronUp className="w-4 h-4" />收起</>) : (<><ChevronDown className="w-4 h-4" />展开全文</>)}
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Plus className="w-5 h-5" /> 写新记录
            </button>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <Calendar className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">点点滴滴</h1>
          <p className="text-xl text-gray-600">记录你我生活的美好瞬间</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : moments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">还没有记录，写下你们的第一个故事吧 💕</div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300"></div>
            <div className="space-y-8">
              {moments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">写新记录</h2>
              <div className="space-y-4">
                <input type="text" placeholder="标题" value={newMoment.title} onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white" />
                <input type="date" value={newMoment.date} onChange={(e) => setNewMoment({...newMoment, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white" />
                <textarea placeholder="记录这一刻的美好..." value={newMoment.content} onChange={(e) => setNewMoment({...newMoment, content: e.target.value})}
                  rows={6} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-gray-900 bg-white" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowAddForm(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">取消</button>
                <button onClick={handleAdd} className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
