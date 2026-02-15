import Countdown from '@/components/Countdown';
import FeatureCard from '@/components/FeatureCard';
import LoveCard from '@/components/LoveCard';
import Avatar from '@/components/Avatar';
import AnimatedHeart from '@/components/AnimatedHeart';
import WaveDivider from '@/components/WaveDivider';
import Header from '@/components/Header';
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  Users,
  Camera,
  List,
  MapPin
} from 'lucide-react';

export default function Home() {
  // 你可以在 .env.local 文件中设置这些值
  const startDate = process.env.NEXT_PUBLIC_START_DATE || '2021-06-01';
  const partner1Name = process.env.NEXT_PUBLIC_PARTNER1_NAME || 'Mao';
  const partner2Name = process.env.NEXT_PUBLIC_PARTNER2_NAME || 'Yi';

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <Header />
      
      {/* 网格背景 */}
      <div className="grid-background min-h-screen">
        
        {/* 顶部头像区域 - 占据屏幕高度的 4/5 */}
        <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-20">
          <div className="container mx-auto px-4 w-full max-w-7xl">
            <div className="flex items-center justify-center gap-12 md:gap-24 lg:gap-32 scale-110 md:scale-125">
              {/* Partner 1 头像 */}
              <Avatar
                name={partner1Name}
                imagePath="/images/partner1.jpg"
                gradientFrom="pink-400"
                gradientTo="purple-400"
              />

              {/* 动态爱心 */}
              <AnimatedHeart />

              {/* Partner 2 头像 */}
              <Avatar
                name={partner2Name}
                imagePath="/images/partner2.jpg"
                gradientFrom="purple-400"
                gradientTo="blue-400"
              />
            </div>
          </div>
          
          {/* 波浪分隔线 */}
          <div className="absolute bottom-0 left-0 right-0">
            <WaveDivider />
          </div>
        </section>

        {/* 倒计时区域 */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl text-center mb-8 text-love-pink font-medium">
                这是我们一起走过的
              </h2>
              <Countdown startDate={startDate} />
            </div>
          </div>
        </section>

        {/* 功能卡片区域 */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              <FeatureCard
                icon={<Calendar className="w-8 h-8 text-emerald-600" />}
                title="点点滴滴"
                description="记录你我生活"
                href="/moments"
                color="bg-emerald-500"
              />
              <FeatureCard
                icon={<MessageSquare className="w-8 h-8 text-blue-600" />}
                title="留言板"
                description="写下留言祝福"
                href="/messages"
                color="bg-blue-500"
              />
              <FeatureCard
                icon={<Users className="w-8 h-8 text-purple-600" />}
                title="关于我们"
                description="我们的经历"
                href="/about"
                color="bg-purple-500"
              />
            </div>

            {/* Love Photo & Love List & Love Footprint */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <LoveCard
                icon={
                  <div className="bg-red-100 p-6 rounded-2xl">
                    <Calendar className="w-16 h-16 text-red-500" />
                    <Heart className="w-8 h-8 text-red-500 fill-red-500 absolute -mt-2 ml-12" />
                  </div>
                }
                title="Love Photo"
                description="恋爱相册 记录最美瞬间"
                href="/photos"
              />
              <LoveCard
                icon={
                  <div className="bg-pink-100 p-6 rounded-2xl">
                    <div className="relative">
                      <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                      <List className="w-10 h-10 text-pink-500 absolute top-8 left-8" />
                    </div>
                  </div>
                }
                title="Love List"
                description="恋爱列表 你我之间的约定"
                href="/list"
              />
              <LoveCard
                icon={
                  <div className="bg-orange-100 p-6 rounded-2xl">
                    <MapPin className="w-16 h-16 text-orange-500" />
                  </div>
                }
                title="Love Footprint"
                description="足迹地图 一起走过的地方"
                href="/footprint"
              />
            </div>
          </div>
        </section>

        {/* 底部装饰 */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-4 text-gray-400">
              <Heart className="w-6 h-6 fill-gray-400" />
              <p className="text-sm">用爱记录每一个美好瞬间</p>
              <Heart className="w-6 h-6 fill-gray-400" />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
