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
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <Header />
      
      {/* 网格背景 */}
      <div className="grid-background min-h-screen">
        
        {/* 顶部头像区域 - 占据屏幕高度的 4/5 */}
        <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden pt-20 pb-14">
          <div className="container mx-auto px-4 w-full max-w-7xl">
            <div className="flex items-center justify-center gap-7 md:gap-14 lg:gap-20 scale-95 md:scale-100">
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
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl text-center mb-6 text-love-pink font-medium">
                这是我们一起走过的
              </h2>
              <Countdown startDate={startDate} />
            </div>
          </div>
        </section>

        {/* 功能卡片区域 */}
        <section className="py-10">
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
                    <Calendar className="h-14 w-14 text-red-500" />
                    <Heart className="absolute -mt-2 ml-10 h-7 w-7 fill-red-500 text-red-500" />
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
                      <Heart className="h-11 w-11 fill-pink-500 text-pink-500" />
                      <List className="absolute left-7 top-7 h-9 w-9 text-pink-500" />
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
                    <MapPin className="h-14 w-14 text-orange-500" />
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
        <section className="py-12">
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
