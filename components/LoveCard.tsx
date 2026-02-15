'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface LoveCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export default function LoveCard({ 
  icon, 
  title, 
  description, 
  href = '#' 
}: LoveCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex items-center gap-6">
        <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
