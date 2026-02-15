import { NextResponse } from 'next/server';

// 缓存中国地图数据，避免重复请求
let cachedData: any = null;

export async function GET() {
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const urls = [
    'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    'https://raw.githubusercontent.com/yezongyang/china-binddata/master/china.json',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } }); // 缓存24小时
      if (res.ok) {
        const data = await res.json();
        // 验证数据格式
        if (data && data.type === 'FeatureCollection' && data.features?.length > 0) {
          cachedData = data;
          return NextResponse.json(data);
        }
      }
    } catch (e) {
      console.error(`Failed to fetch from ${url}:`, e);
    }
  }

  return NextResponse.json({ error: 'Failed to load China map data' }, { status: 500 });
}
