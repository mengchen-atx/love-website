'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  name: string;
  imagePath: string;
  gradientFrom: string;
  gradientTo: string;
}

// Tailwind 需要完整的 class 名才能在构建时保留，动态拼接会被 purge
const gradientFromMap: Record<string, string> = {
  'pink-400': 'from-pink-400',
  'purple-400': 'from-purple-400',
  'blue-400': 'from-blue-400',
};

const gradientToMap: Record<string, string> = {
  'pink-400': 'to-pink-400',
  'purple-400': 'to-purple-400',
  'blue-400': 'to-blue-400',
};

export default function Avatar({
  name,
  imagePath,
  gradientFrom,
  gradientTo
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const fromClass = gradientFromMap[gradientFrom] || 'from-pink-400';
  const toClass = gradientToMap[gradientTo] || 'to-purple-400';

  // 创建占位符 SVG
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23e879a0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white' font-family='Arial'%3E${name.charAt(0)}%3C/text%3E%3C/svg%3E`;

  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${fromClass} ${toClass} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
        <Image
          src={imageError ? placeholderSvg : imagePath}
          alt={name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          unoptimized={imageError}
        />
      </div>
      <p className="text-center mt-4 text-xl md:text-2xl font-semibold text-gray-700">
        {name}
      </p>
    </div>
  );
}
