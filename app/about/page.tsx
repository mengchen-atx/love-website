'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Heart, Calendar, MapPin, Star } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    {
      date: '2021-06-01',
      title: '我们相遇',
      description: '在咖啡馆的一次偶然邂逅，改变了我们的人生',
      icon: Heart
    },
    {
      date: '2021-07-14',
      title: '第一次约会',
      description: '去了海边，看了日落，牵手了',
      icon: MapPin
    },
    {
      date: '2021-08-20',
      title: '在一起',
      description: '我鼓起勇气表白，你说了愿意',
      icon: Star
    },
    {
      date: '2022-06-01',
      title: '一周年纪念',
      description: '一起度过了365个日夜',
      icon: Calendar
    },
    {
      date: '2024-02-14',
      title: '今天',
      description: '创建了这个属于我们的网站，记录未来的每一天',
      icon: Heart
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 顶部导航 */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Users className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            关于我们
          </h1>
          <p className="text-xl text-gray-600">我们的经历</p>
        </div>

        {/* 简介卡片 */}
        <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Mao & Yi 的爱情故事
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              两个人，从陌生到熟悉，从朋友到恋人。
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              我们用这个网站记录彼此的点点滴滴，见证我们的爱情成长。
              每一张照片、每一段文字、每一个约定，都是我们爱情的印记。
            </p>
          </div>
        </div>

        {/* 时间轴 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            我们的重要时刻
          </h2>
          
          <div className="relative">
            {/* 中间的线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 hidden md:block"></div>

            {/* 里程碑 */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col gap-8`}
                >
                  {/* 左侧/右侧内容 */}
                  <div className="flex-1 md:text-right text-center">
                    <div className={`inline-block ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                      <p className="text-sm text-gray-500 mb-2">{milestone.date}</p>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* 中间图标 */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <milestone.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* 占位 */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部卡片 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mao</h3>
            <p className="text-gray-600">
              喜欢浪漫，喜欢记录生活，喜欢和你在一起的每一天。
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Yi</h3>
            <p className="text-gray-600">
              喜欢花，喜欢你的陪伴，珍惜我们在一起的每个瞬间。
            </p>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Heart className="w-6 h-6 fill-gray-400" />
            <p className="text-sm">愿我们的爱情，如同这个网站，永远美好</p>
            <Heart className="w-6 h-6 fill-gray-400" />
          </div>
        </div>
      </div>
    </main>
  );
}
