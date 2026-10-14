import React from 'react';
import LiveClock from './LiveClock';
import dualLogo from '../../../common/assets/kiit-kims-dual-logo.png';
import kimsEmblem from '../../../common/assets/kims-emblem.png';

/**
 * DisplayHeader
 *
 * Exact recreation of Hospital Header from physical Totem Stand Kiosk & Source Template:
 * - Dual Emblem (KIIT Logo | KIMS Crest) centered at the top.
 * - Bold Emerald Serif Heading:
 *     - SSCC: "KIMS SUPER SPECIALITY & CANCER CENTRE"
 *     - PBMH: "PRADYUMNA BAL MEMORIAL HOSPITAL"
 * - Live clock in top-right corner.
 *
 * @param {{ theme: object, branch: string }} props
 */
const DisplayHeader = ({ theme, branch }) => {
  const branchKey = (branch || '').toLowerCase();
  const isSscc = branchKey === 'sscc';

  return (
    <header className="w-full shrink-0 z-20 py-2 sm:py-3 px-3 sm:px-6 md:px-8 relative flex flex-col items-center bg-white/85 backdrop-blur-sm border-b border-emerald-900/10 shadow-xs">
      {/* Top row with LiveClock aligned to top right */}
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Left balance spacer matching clock width */}
        <div className="w-28 sm:w-40 md:w-52 lg:w-60 hidden sm:block shrink-0" />

        {/* Center: Hospital Dual-Emblem Logo & Heading matching Stand Kiosk */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Dual Emblem Seal (KIIT | KIMS) */}
          <img
            src={isSscc ? dualLogo : kimsEmblem}
            alt="KIIT | KIMS"
            className="h-9 sm:h-11 md:h-13 lg:h-15 w-auto object-contain drop-shadow-sm mb-1 sm:mb-1.5"
          />

          {/* Main Hospital Name in Emerald Serif */}
          <h1
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-extrabold text-[#006837] tracking-wider uppercase leading-tight"
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          >
            {isSscc ? (
              <span className="flex flex-col items-center">
                <span className="leading-tight">KIMS SUPER SPECIALITY</span>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-widest mt-0.5 leading-tight">
                  & CANCER CENTRE
                </span>
              </span>
            ) : (
              <span className="leading-tight">PRADYUMNA BAL MEMORIAL HOSPITAL</span>
            )}
          </h1>
        </div>

        {/* Right: Highlighted Live Clock */}
        <div className="w-28 sm:w-40 md:w-52 lg:w-60 flex justify-end shrink-0">
          <LiveClock />
        </div>
      </div>
    </header>
  );
};

export default DisplayHeader;
