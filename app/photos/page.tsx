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
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 返回首页
          </Link>
          <button onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2.5 text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Upload className="h-4 w-4" /> 上传照片
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Heart className="h-8 w-8 fill-red-500 text-red-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">Love Photo</h1>
          <p className="text-base text-gray-600">恋爱相册 - 记录最美瞬间</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : photos.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
            <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-30" />
            <p className="text-base">还没有照片，上传你们的第一张吧 💕</p>
          </div>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                onClick={() => setSelectedPhoto(photo)}>
                <div className="aspect-square relative overflow-hidden">
                  <Image src={photo.url} alt={photo.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-3.5">
                  <h3 className="mb-1 text-sm font-semibold text-gray-800">{photo.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="h-3.5 w-3.5" />{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 照片详情 */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button onClick={() => setSelectedPhoto(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-1.5 transition-colors hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
                <div className="relative w-full h-96">
                  <Image src={selectedPhoto.url} alt={selectedPhoto.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain" />
                </div>
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-800">{selectedPhoto.title}</h2>
                <p className="mb-3 flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" />{selectedPhoto.date}</p>
                {selectedPhoto.description && <p className="mb-5 text-sm text-gray-600">{selectedPhoto.description}</p>}
                <button onClick={() => handleDelete(selectedPhoto.id, selectedPhoto.url)}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm text-white transition-colors hover:bg-red-600">删除照片</button>
              </div>
            </div>
          </div>
        )}

        {/* 上传对话框 */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetUploadForm}>
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">上传照片</h2>
                <button onClick={resetUploadForm} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>

              {/* 隐藏的文件输入 */}
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }} />

              {/* 拖拽/点击区域 */}
              {previewUrl ? (
                <div className="relative mb-6">
                  <img src={previewUrl} alt="预览" className="max-h-64 w-full rounded-2xl border border-gray-200 object-contain" />
                  <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                  className="mb-5 cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center transition-colors hover:border-pink-400">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-600">点击选择照片 或 拖拽照片到这里</p>
                  <p className="text-xs text-gray-400">支持 JPG, PNG, WEBP 格式</p>
                </div>
              )}

              <div className="space-y-4">
                <input type="text" placeholder="照片标题" value={uploadForm.title} onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="date" value={uploadForm.date} onChange={(e) => setUploadForm({...uploadForm, date: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <textarea placeholder="照片描述（可选）" rows={3} value={uploadForm.description} onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={resetUploadForm} className="flex-1 rounded-xl border border-gray-300 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">取消</button>
                <button onClick={handleUpload} disabled={!selectedFile || !uploadForm.title || uploading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2.5 text-sm text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
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
