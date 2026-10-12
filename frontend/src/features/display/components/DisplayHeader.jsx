import React from 'react';
import LiveClock from './LiveClock';
import kimsEmblem from '../../../common/assets/kims-emblem.png';

/**
 * DisplayHeader
 *
 * Recreates the exact Hospital Header from Image 1 (SSCC) and Image 2 (PBMH):
 * - KIMS Caduceus Seal emblem at top center.
 * - Sub-heading: "Kalinga Institute of Medical Sciences (KIMS)".
 * - Branch Heading:
 *     - SSCC: "KIMS SUPER SPECIALITY & CANCER CENTER"
 *     - PBMH: "PRADYUMNA BAL MEMORIAL HOSPITAL"
 * - Tagline: "“Healthcare with Healing Touch”".
 * - Curved green arch beneath the branding framing the doctor card stage.
 * - Live clock in top-right corner.
 *
 * @param {{ theme: object, branch: string }} props
 */
const DisplayHeader = ({ theme, branch }) => {
  const branchKey = (branch || '').toLowerCase();
  const isSscc = branchKey === 'sscc';

  return (
    <header className="w-full shrink-0 z-20 pt-2 sm:pt-3 pb-0 px-4 sm:px-8 relative flex flex-col items-center bg-white/75 backdrop-blur-md">
      {/* Top row with LiveClock aligned to top right */}
      <div className="w-full flex items-center justify-between">
        <div className="w-20 hidden sm:block" />

        {/* Center: Hospital Logo & Heading matching Images 1 & 2 */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Emblem Seal */}
          <img
            src={kimsEmblem}
            alt="KIMS Emblem"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-sm mb-1"
          />

          {/* Subheading */}
          <span className="text-[#006837] text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold tracking-wide">
            Kalinga Institute of Medical Sciences (KIMS)
          </span>

          {/* Main Hospital Name */}
          <h1
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-[#006837] tracking-wide sm:tracking-wider uppercase leading-tight mt-0.5"
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          >
            {isSscc ? 'KIMS SUPER SPECIALITY & CANCER CENTER' : 'PRADYUMNA BAL MEMORIAL HOSPITAL'}
          </h1>

          {/* Tagline */}
          <p
            className="text-[#006837] text-[11px] sm:text-xs md:text-sm lg:text-base italic font-serif mt-0.5 tracking-wide"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            “Healthcare with Healing Touch”
          </p>
        </div>

        {/* Subtle Live Clock */}
        <div className="w-20 flex justify-end shrink-0">
          <LiveClock />
        </div>
      </div>

      {/* Curved green arch element matching Images 1 & 2 */}
      <div className="w-full flex justify-center -mb-2 mt-1 sm:mt-2 pointer-events-none">
        <svg
          viewBox="0 0 1000 45"
          className="w-full max-w-[1280px] h-6 sm:h-8 md:h-10 lg:h-12 overflow-visible"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 42 Q 500 -15 1000 42"
            fill="none"
            stroke="#006837"
            strokeWidth="3.5"
          />
        </svg>
      </div>
    </header>
  );
};

export default DisplayHeader;
