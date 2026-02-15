'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  name: string;
  imagePath: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function Avatar({ 
  name, 
  imagePath, 
  gradientFrom, 
  gradientTo 
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // 创建占位符 SVG
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23${gradientFrom.replace('#', '')}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white' font-family='Arial'%3E${name.charAt(0)}%3C/text%3E%3C/svg%3E`;

  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
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
