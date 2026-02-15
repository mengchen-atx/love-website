'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, MessageSquare, Heart } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '今天天气真好，想和你一起去散步 ☀️',
      author: 'Mao',
      timestamp: '2024-02-14 10:30'
    },
    {
      id: '2',
      content: '好呀！我们去公园吧，那里的樱花开了 🌸',
      author: 'Yi',
      timestamp: '2024-02-14 10:32'
    },
    {
      id: '3',
      content: '爱你 ❤️',
      author: 'Mao',
      timestamp: '2024-02-14 10:35'
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('Mao');

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        author: currentUser,
        timestamp: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-')
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">当前身份：</span>
            <select
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Mao">Mao</option>
              <option value="Yi">Yi</option>
            </select>
          </div>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            留言板
          </h1>
          <p className="text-xl text-gray-600">写下爱的祝福</p>
        </div>

        {/* 留言区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          {/* 留言列表 */}
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.author === 'Mao' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[70%] ${message.author === 'Mao' ? '' : 'flex flex-col items-end'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      message.author === 'Mao' 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {message.author}
                    </span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.author === 'Mao'
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="写下你想说的话..."
              rows={3}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>

        {/* 装饰 */}
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <Heart className="w-5 h-5 fill-gray-400" />
          <p className="text-sm">每一句话都是爱的表达</p>
          <Heart className="w-5 h-5 fill-gray-400" />
        </div>
      </div>
    </main>
  );
}
