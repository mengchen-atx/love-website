'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Locate, Loader2 } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { supabase } from '@/lib/supabase';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const US_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const CHINA_URL = '/china-provinces.json'; // 本地静态文件，不存在跨域问题

type MapView = 'world' | 'china' | 'usa';

export default function FootprintPage() {
  const [view, setView] = useState<MapView>('world');
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [nameMap, setNameMap] = useState<Map<string, string>>(new Map());
  const [tooltip, setTooltip] = useState('');
  const [loading, setLoading] = useState(true);
  const [chinaGeo, setChinaGeo] = useState<any>(null);

  // 预加载中国地图数据
  useEffect(() => {
    fetch(CHINA_URL)
      .then(res => res.json())
      .then(data => setChinaGeo(data))
      .catch(err => console.error('中国地图加载失败:', err));
  }, []);

  useEffect(() => { fetchFootprints(); }, []);

  const fetchFootprints = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from('footprints').select('*');
    if (error) console.error('加载足迹数据失败:', error);
    if (data) {
      const ids = new Set<string>();
      const names = new Map<string, string>();
      data.forEach((d: any) => { ids.add(d.place_id); names.set(d.place_id, d.place_name); });
      setVisited(ids);
      setNameMap(names);
    }
    setLoading(false);
  };

  const togglePlace = async (placeId: string, placeName: string, placeType: string) => {
    if (!supabase) return;
    const newVisited = new Set(visited);
    const newNames = new Map(nameMap);

    if (visited.has(placeId)) {
      const { error } = await supabase.from('footprints').delete().eq('place_id', placeId);
      if (error) { alert('操作失败：' + error.message + '\n\n请确认已在 Supabase 中创建 footprints 表'); return; }
      newVisited.delete(placeId);
      newNames.delete(placeId);
    } else {
      const { error } = await supabase.from('footprints').insert([{ place_id: placeId, place_name: placeName, place_type: placeType }]);
      if (error) { alert('操作失败：' + error.message + '\n\n请确认已在 Supabase 中创建 footprints 表'); return; }
      newVisited.add(placeId);
      newNames.set(placeId, placeName);
    }

    setVisited(newVisited);
    setNameMap(newNames);
  };

  const handleGeoClick = (geo: any) => {
    if (view === 'world') {
      if (geo.id === '156') { setView('china'); return; }
      if (geo.id === '840') { setView('usa'); return; }
      const name = geo.properties?.name || `Country ${geo.id}`;
      togglePlace(`country-${geo.id}`, name, 'country');
    } else if (view === 'china') {
      const adcode = geo.properties?.adcode;
      const name = geo.properties?.name || '';
      if (!adcode || !name) return;
      togglePlace(`cn-${adcode}`, name, 'province');
    } else {
      const name = geo.properties?.name || `State ${geo.id}`;
      togglePlace(`us-${geo.id}`, name, 'state');
    }
  };

  const getPlaceId = (geo: any): string => {
    if (view === 'world') return `country-${geo.id}`;
    if (view === 'china') return `cn-${geo.properties?.adcode}`;
    return `us-${geo.id}`;
  };

  const hasAnyVisited = (prefix: string) => {
    for (const id of visited) { if (id.startsWith(prefix)) return true; }
    return false;
  };

  const countVisited = (prefix: string) => {
    let c = 0;
    for (const id of visited) { if (id.startsWith(prefix)) c++; }
    return c;
  };

  const getFill = (geo: any): string => {
    if (view === 'world') {
      if (geo.id === '156') return hasAnyVisited('cn-') ? '#f9a8d4' : '#93c5fd';
      if (geo.id === '840') return hasAnyVisited('us-') ? '#f9a8d4' : '#93c5fd';
      return visited.has(`country-${geo.id}`) ? '#ec4899' : '#e5e7eb';
    }
    return visited.has(getPlaceId(geo)) ? '#ec4899' : '#e5e7eb';
  };

  const getHoverFill = (geo: any): string => {
    if (view === 'world') {
      if (geo.id === '156' || geo.id === '840') return '#60a5fa';
      return visited.has(`country-${geo.id}`) ? '#db2777' : '#d1d5db';
    }
    return visited.has(getPlaceId(geo)) ? '#db2777' : '#d1d5db';
  };

  const getTooltipText = (geo: any): string => {
    const name = geo.properties?.name || '';
    if (view === 'world') {
      if (geo.id === '156') return name + ' (点击查看省份)';
      if (geo.id === '840') return name + ' (点击查看各州)';
      return visited.has(`country-${geo.id}`) ? name + ' (已去过)' : name;
    }
    const pid = getPlaceId(geo);
    return visited.has(pid) ? name + ' (已去过)' : name;
  };

  const getVisitedList = (prefix: string) => {
    const list: string[] = [];
    nameMap.forEach((name, id) => { if (id.startsWith(prefix)) list.push(name); });
    return list.sort();
  };

  // 国家列表：包含普通国家 + 如果有省/州去过则加上中国/美国
  const getCountryList = () => {
    const list = getVisitedList('country-');
    if (hasAnyVisited('cn-') && !list.includes('China')) list.push('China');
    if (hasAnyVisited('us-') && !list.includes('United States of America')) list.push('United States of America');
    return list.sort();
  };

  const totalCountries = () => {
    let c = countVisited('country-');
    if (hasAnyVisited('cn-')) c++;
    if (hasAnyVisited('us-')) c++;
    return c;
  };

  const renderGeography = (geo: any) => (
    <Geography key={geo.rsmKey} geography={geo}
      onClick={() => handleGeoClick(geo)}
      onMouseEnter={() => setTooltip(getTooltipText(geo))}
      onMouseLeave={() => setTooltip('')}
      style={{
        default: { fill: getFill(geo), stroke: '#fff', strokeWidth: view === 'world' ? 0.5 : 1, outline: 'none' },
        hover: { fill: getHoverFill(geo), stroke: '#fff', strokeWidth: view === 'world' ? 0.5 : 1, outline: 'none', cursor: 'pointer' },
        pressed: { outline: 'none' },
      }}
    />
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> 返回首页
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <MapPin className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Love Footprint</h1>
          <p className="text-xl text-gray-600">我们一起走过的地方</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 text-center shadow-md cursor-pointer hover:shadow-lg transition-all" onClick={() => setView('world')}>
            <p className="text-3xl font-bold text-orange-600">{totalCountries()}</p>
            <p className="text-sm text-gray-500">国家</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-md cursor-pointer hover:shadow-lg transition-all" onClick={() => setView('china')}>
            <p className="text-3xl font-bold text-red-600">{countVisited('cn-')}</p>
            <p className="text-sm text-gray-500">中国省份</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-md cursor-pointer hover:shadow-lg transition-all" onClick={() => setView('usa')}>
            <p className="text-3xl font-bold text-blue-600">{countVisited('us-')}</p>
            <p className="text-sm text-gray-500">美国州</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          {([
            { key: 'world' as MapView, label: '世界地图' },
            { key: 'china' as MapView, label: '中国地图' },
            { key: 'usa' as MapView, label: '美国地图' },
          ]).map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                view === key
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Tooltip - 固定高度，不导致页面抖动 */}
        <div className="h-10 flex items-center justify-center mb-2">
          {tooltip && (
            <span className="inline-block px-4 py-2 bg-gray-800 text-white rounded-full text-sm shadow-lg">
              {tooltip}
            </span>
          )}
        </div>

        {/* Map */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* 世界地图 */}
          {view === 'world' && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [10, 20], scale: 147 }}
              width={800} height={450}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={WORLD_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map(renderGeography)
                }
              </Geographies>
            </ComposableMap>
          )}

          {/* 中国地图 - 使用预加载的数据对象 */}
          {view === 'china' && (
            chinaGeo ? (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [105, 35], scale: 600 }}
                width={800} height={600}
                style={{ width: '100%', height: 'auto' }}
              >
                <Geographies geography={chinaGeo}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies
                      .filter((geo: any) => geo.properties?.adcode && geo.properties?.name)
                      .map(renderGeography)
                  }
                </Geographies>
              </ComposableMap>
            ) : (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                <span className="ml-3 text-gray-500">加载中国地图...</span>
              </div>
            )
          )}

          {/* 美国地图 */}
          {view === 'usa' && (
            <ComposableMap projection="geoAlbersUsa" width={800} height={500}
              style={{ width: '100%', height: 'auto' }}>
              <Geographies geography={US_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map(renderGeography)
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-gray-400 mt-4">
          {view === 'world'
            ? '点击国家标记去过 | 中国和美国（蓝色）点击查看省/州详情'
            : '点击标记为去过，再次点击取消 | '}
          {view !== 'world' && (
            <button onClick={() => setView('world')} className="text-pink-500 hover:text-pink-700 underline">返回世界地图</button>
          )}
        </p>

        {/* Visited List */}
        {(visited.size > 0 || hasAnyVisited('cn-') || hasAnyVisited('us-')) && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Locate className="w-5 h-5 text-pink-500" /> 已去过的地方
            </h3>
            <div className="space-y-4">
              {totalCountries() > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">国家</p>
                  <div className="flex flex-wrap gap-2">
                    {getCountryList().map(name => (
                      <span key={name} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              {countVisited('cn-') > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">中国省份</p>
                  <div className="flex flex-wrap gap-2">
                    {getVisitedList('cn-').map(name => (
                      <span key={name} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              {countVisited('us-') > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">美国州</p>
                  <div className="flex flex-wrap gap-2">
                    {getVisitedList('us-').map(name => (
                      <span key={name} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 text-gray-400 mt-8 mb-4">
          <Heart className="w-5 h-5 fill-gray-400" />
          <p className="text-sm">世界那么大，我想和你一起看</p>
          <Heart className="w-5 h-5 fill-gray-400" />
        </div>
      </div>
    </main>
  );
}
