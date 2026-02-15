'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Heart, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  description?: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
      title: '美好的一天',
      date: '2024-02-01',
      description: '一起去海边'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
      title: '夕阳',
      date: '2024-01-28',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
      title: '咖啡时光',
      date: '2024-01-25',
    },
  ]);
  
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这张照片吗？')) {
      setPhotos(photos.filter(p => p.id !== id));
      setSelectedPhoto(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            上传照片
          </button>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Love Photo
          </h1>
          <p className="text-xl text-gray-600">恋爱相册 - 记录最美瞬间</p>
        </div>

        {/* 照片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{photo.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {photo.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 照片详情模态框 */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="relative w-full h-96">
                  <Image
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPhoto.title}</h2>
                <p className="text-gray-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {selectedPhoto.date}
                </p>
                {selectedPhoto.description && (
                  <p className="text-gray-600 mb-6">{selectedPhoto.description}</p>
                )}
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  删除照片
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 上传模态框 */}
        {showUpload && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">上传照片</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center mb-6 hover:border-pink-400 transition-colors cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">点击或拖拽照片到这里</p>
                <p className="text-sm text-gray-400">支持 JPG, PNG, WEBP 格式</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="照片标题"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <textarea
                  placeholder="照片描述（可选）"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowUpload(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  上传
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
