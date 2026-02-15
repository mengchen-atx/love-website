'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, Edit, Trash2 } from 'lucide-react';

interface Moment {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<Moment[]>([
    {
      id: '1',
      title: '第一次约会',
      content: '今天和她一起去了咖啡馆，聊了很多，时间过得好快。她笑起来真好看。',
      date: '2024-02-10',
      author: 'Mao'
    },
    {
      id: '2',
      title: '一起看电影',
      content: '看了一部浪漫的电影，中间她偷偷牵了我的手，心跳好快。',
      date: '2024-02-08',
      author: 'Yi'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMoment, setNewMoment] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Mao'
  });

  const handleAdd = () => {
    if (newMoment.title && newMoment.content) {
      setMoments([
        {
          id: Date.now().toString(),
          ...newMoment
        },
        ...moments
      ]);
      setNewMoment({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Ki'
      });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      setMoments(moments.filter(m => m.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            写新记录
          </button>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <Calendar className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            点点滴滴
          </h1>
          <p className="text-xl text-gray-600">记录你我生活的美好瞬间</p>
        </div>

        {/* 时间轴 */}
        <div className="relative">
          {/* 中间的线 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300"></div>

          {/* 记录列表 */}
          <div className="space-y-8">
            {moments.map((moment, index) => (
              <div key={moment.id} className="relative pl-20">
                {/* 时间轴点 */}
                <div className="absolute left-6 top-6 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-4 border-white shadow-lg"></div>

                {/* 卡片 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{moment.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {moment.date}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-xs font-medium">
                          {moment.author}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(moment.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{moment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 添加表单模态框 */}
        {showAddForm && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">写新记录</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="标题"
                  value={newMoment.title}
                  onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newMoment.date}
                    onChange={(e) => setNewMoment({...newMoment, date: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={newMoment.author}
                    onChange={(e) => setNewMoment({...newMoment, author: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mao">Mao</option>
                    <option value="Yi">Yi</option>
                  </select>
                </div>

                <textarea
                  placeholder="记录这一刻的美好..."
                  value={newMoment.content}
                  onChange={(e) => setNewMoment({...newMoment, content: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
