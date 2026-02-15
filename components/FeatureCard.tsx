'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  color: string;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  href = '#',
  color 
}: FeatureCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
        {/* 背景装饰 */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
        
        <div className="relative z-10">
          <div className={`inline-flex p-4 rounded-xl ${color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
