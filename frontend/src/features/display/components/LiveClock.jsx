import React, { useState, useEffect } from 'react';

/**
 * LiveClock — displays current date and time in the display header.
 * Extracted from DisplayScreen.jsx (was an inline component).
 */
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="flex flex-col items-end justify-center bg-white/95 border border-[#006837]/30 shadow-sm rounded-xl px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-right">
      <p className="text-xs sm:text-sm md:text-base font-bold text-[#006837] uppercase tracking-wide whitespace-nowrap">
        {dateString}
      </p>
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#004d25] font-mono tracking-tight leading-none mt-1">
        {timeString}
      </p>
    </div>
  );
};

export default LiveClock;
