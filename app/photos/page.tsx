'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Heart, Calendar, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  description?: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], description: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('photos').select('*').order('date', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title || !supabase) return;
    setUploading(true);

    try {
      // 上传到 Supabase Storage
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // 获取公开 URL
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      // 保存到数据库
      const { data, error } = await supabase.from('photos')
        .insert([{ url: publicUrl, title: uploadForm.title, date: uploadForm.date, description: uploadForm.description || null }])
        .select().single();

      if (data) {
        setPhotos([data, ...photos]);
        resetUploadForm();
      }
    } catch (error: any) {
      alert('上传失败：' + (error.message || '请稍后重试'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('确定要删除这张照片吗？') || !supabase) return;

    // 从 Storage 删除文件
    const fileName = url.split('/').pop();
    if (fileName) {
      await supabase.storage.from('photos').remove([fileName]);
    }

    // 从数据库删除
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (!error) {
      setPhotos(photos.filter(p => p.id !== id));
      setSelectedPhoto(null);
    }
  };

  const resetUploadForm = () => {
    setShowUpload(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadForm({ title: '', date: new Date().toISOString().split('T')[0], description: '' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> 返回首页
          </Link>
          <button onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Upload className="w-5 h-5" /> 上传照片
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Love Photo</h1>
          <p className="text-xl text-gray-600">恋爱相册 - 记录最美瞬间</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-30" />
            <p className="text-lg">还没有照片，上传你们的第一张吧 💕</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {photos.map((photo) => (
              <div key={photo.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                onClick={() => setSelectedPhoto(photo)}>
                <div className="aspect-square relative overflow-hidden">
                  <Image src={photo.url} alt={photo.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" unoptimized />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{photo.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" />{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 照片详情 */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
                  <X className="w-6 h-6" />
                </button>
                <div className="relative w-full h-96">
                  <Image src={selectedPhoto.url} alt={selectedPhoto.title} fill className="object-contain" unoptimized />
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPhoto.title}</h2>
                <p className="text-gray-500 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" />{selectedPhoto.date}</p>
                {selectedPhoto.description && <p className="text-gray-600 mb-6">{selectedPhoto.description}</p>}
                <button onClick={() => handleDelete(selectedPhoto.id, selectedPhoto.url)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">删除照片</button>
              </div>
            </div>
          </div>
        )}

        {/* 上传对话框 */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetUploadForm}>
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">上传照片</h2>
                <button onClick={resetUploadForm} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>

              {/* 隐藏的文件输入 */}
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }} />

              {/* 拖拽/点击区域 */}
              {previewUrl ? (
                <div className="relative mb-6">
                  <img src={previewUrl} alt="预览" className="w-full max-h-64 object-contain rounded-2xl border border-gray-200" />
                  <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center mb-6 hover:border-pink-400 transition-colors cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">点击选择照片 或 拖拽照片到这里</p>
                  <p className="text-sm text-gray-400">支持 JPG, PNG, WEBP 格式</p>
                </div>
              )}

              <div className="space-y-4">
                <input type="text" placeholder="照片标题" value={uploadForm.title} onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white" />
                <input type="date" value={uploadForm.date} onChange={(e) => setUploadForm({...uploadForm, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white" />
                <textarea placeholder="照片描述（可选）" rows={3} value={uploadForm.description} onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-gray-900 bg-white" />
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={resetUploadForm} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">取消</button>
                <button onClick={handleUpload} disabled={!selectedFile || !uploadForm.title || uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? '上传中...' : '上传'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
