'use client';

import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const CHINA_URL = '/china-provinces.json';

export default function DebugChinaMap() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Starting to fetch China map data...');
    fetch(CHINA_URL)
      .then(response => {
        console.log('📡 Fetch response:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        console.log('✅ JSON data loaded:', {
          type: jsonData.type,
          featuresCount: jsonData.features?.length,
          firstFeature: jsonData.features?.[0]?.properties
        });
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading China map:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-lg font-bold">⏳ Loading China map data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-100 border border-red-400 rounded">
        <p className="text-lg font-bold text-red-700">❌ Error: {error}</p>
        <p className="mt-2 text-sm">Check the browser console for more details.</p>
      </div>
    );
  }

  if (!data || !data.features || data.features.length === 0) {
    return (
      <div className="p-8 bg-orange-100 border border-orange-400 rounded">
        <p className="text-lg font-bold">⚠️ No data loaded</p>
        <p className="mt-2">Data: {JSON.stringify(data)}</p>
      </div>
    );
  }

  console.log('🗺️ Rendering China map with', data.features.length, 'provinces');

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-100 border border-green-400 rounded">
        <p className="text-lg font-bold text-green-700">✅ Data loaded successfully!</p>
        <p className="text-sm mt-2">
          Type: {data.type}<br/>
          Features: {data.features.length}<br/>
          First province: {data.features[0]?.properties?.name} (adcode: {data.features[0]?.properties?.adcode})
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [105, 35], scale: 600 }}
          width={800}
          height={600}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={data}>
            {({ geographies }: { geographies: any[] }) => {
              console.log('🎨 Rendering', geographies.length, 'geographies');
              return geographies
                .filter((geo: any) => {
                  const hasAdcode = !!geo.properties?.adcode;
                  const hasName = !!geo.properties?.name;
                  if (!hasAdcode || !hasName) {
                    console.warn('⚠️ Skipping geography without adcode/name:', geo.properties);
                  }
                  return hasAdcode && hasName;
                })
                .map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: '#e5e7eb',
                        stroke: '#fff',
                        strokeWidth: 1,
                        outline: 'none'
                      },
                      hover: {
                        fill: '#d1d5db',
                        stroke: '#fff',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: 'pointer'
                      },
                      pressed: {
                        outline: 'none'
                      }
                    }}
                  />
                ));
            }}
          </Geographies>
        </ComposableMap>
      </div>

      <div className="p-4 bg-blue-100 border border-blue-400 rounded">
        <p className="text-sm font-bold mb-2">All Provinces:</p>
        <div className="flex flex-wrap gap-2">
          {data.features.map((f: any) => (
            <span key={f.properties.adcode} className="px-2 py-1 bg-white rounded text-xs">
              {f.properties.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
