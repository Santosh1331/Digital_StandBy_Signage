import React from 'react';
import { Mail, Globe, Phone } from 'lucide-react';

/**
 * DisplayFooter
 *
 * Recreates the exact Hospital Footer from Image 1 and Image 2:
 * - Hospital name & campus address on the left side.
 * - Contact info (Email, Website, Phone) on the right side with vertical separator.
 * - Dual colored bottom accent stripe (Emerald Green + Deep Navy Blue).
 * - Fully responsive across 1080p, 720p, and portrait orientations.
 *
 * @param {{ theme: object }} props
 */
const DisplayFooter = ({ theme }) => {
  return (
    <footer className="w-full shrink-0 z-20 bg-white/95 backdrop-blur-md pt-2 sm:pt-2.5 flex flex-col justify-end shadow-[0_-10px_25px_rgba(0,0,0,0.04)] border-t border-slate-200/70">
      <div className="w-full px-4 sm:px-8 pb-2 sm:pb-2.5 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 text-slate-800">
        {/* Left: Hospital Name & Address */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3
            className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight text-[#006837]"
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          >
            Kalinga Institute of Medical Sciences (KIMS)
          </h3>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 font-medium mt-0.5">
            Kushabhadra Campus (KIIT Campus-5), Patia, Bhubaneswar - 751024, Odisha
          </p>
        </div>

        {/* Right: Contact Information matching Images 1 & 2 */}
        <div className="flex items-center gap-3 md:border-l md:border-slate-300 md:pl-4">
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center gap-1.5 sm:gap-3 md:gap-1 lg:gap-3 text-[10px] sm:text-xs md:text-sm font-medium text-slate-700">
            <a
              href="mailto:info@kims.ac.in"
              className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>info@kims.ac.in</span>
            </a>

            <a
              href="https://kims.kiit.ac.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>https://kims.kiit.ac.in</span>
            </a>

            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>0674 2304400 / 7111000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Bottom Accent Stripes matching Images 1 & 2 */}
      <div className="w-full flex flex-col shrink-0">
        {/* Top Accent Stripe: Emerald Green */}
        <div className="w-full h-1 sm:h-1.5 bg-[#008f4c]" />
        {/* Bottom Accent Stripe: Deep Navy Blue */}
        <div className="w-full h-2 sm:h-2.5 bg-[#172554]" />
      </div>
    </footer>
  );
};

export default DisplayFooter;
