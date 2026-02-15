'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ startDate }: { startDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const difference = now - start;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      <TimeUnit value={timeLeft.days} unit="天" />
      <TimeUnit value={timeLeft.hours} unit="时" />
      <TimeUnit value={timeLeft.minutes} unit="分" />
      <TimeUnit value={timeLeft.seconds} unit="秒" />
    </div>
  );
}

function TimeUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex items-baseline">
      <span className="text-4xl md:text-6xl font-bold text-gray-800">
        {value}
      </span>
      <span className="text-xl md:text-2xl text-gray-600 ml-1">
        {unit}
      </span>
    </div>
  );
}
