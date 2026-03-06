'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, MessageSquare, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Message {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from('messages').select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (data) setMessages(data.reverse());
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !supabase || !currentUser) return;
    const { data } = await supabase
      .from('messages').insert([{ content: newMessage, author: currentUser }]).select().single();
    if (data) {
      setMessages([...messages, data]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 返回首页
          </Link>
          {currentUser && (
            <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs text-gray-600 shadow-sm">
              当前身份：<span className="font-semibold text-pink-600">{currentUser}</span>
            </span>
          )}
        </div>

        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">留言板</h1>
          <p className="text-base text-gray-600">写下爱的祝福</p>
        </div>

        <div className="mb-5 rounded-3xl bg-white/80 p-5 shadow-2xl backdrop-blur-sm">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : (
            <div className="mb-5 max-h-[460px] space-y-3 overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-400">还没有留言，写下第一条吧 💕</div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.author === 'Mao' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] ${message.author === 'Mao' ? '' : 'flex flex-col items-end'}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        message.author === 'Mao' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                      }`}>{message.author}</span>
                      <span className="text-xs text-gray-400">{formatTime(message.created_at)}</span>
                    </div>
                    <div className={`rounded-2xl px-3.5 py-2.5 ${
                      message.author === 'Mao'
                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800'
                        : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="flex gap-2.5">
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="写下你想说的话..." rows={3}
              className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleSend} disabled={!newMessage.trim()}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">按 Enter 发送，Shift + Enter 换行</p>
        </div>

        <div className="flex items-center justify-center gap-2.5 text-gray-400">
          <Heart className="h-4 w-4 fill-gray-400" />
          <p className="text-sm">每一句话都是爱的表达</p>
          <Heart className="h-4 w-4 fill-gray-400" />
        </div>
      </div>
    </main>
  );
}
