import React from 'react';
import { Clock, User } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getFullPhotoUrl = (url) => {
  if (!url) return '';
  const baseMediaUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : window.location.origin;
  return `${baseMediaUrl}${url}`;
};

/**
 * DoctorCard
 *
 * Exact recreation of Image 1 (SSCC) and Image 2 (PBMH) doctor display card:
 * - Centered vertical card with responsive aspect ratio and smooth rounded corners.
 * - Blurred clinical corridor background.
 * - Dynamic doctor photo (or exact frosted avatar outline placeholder when no photo is available).
 * - Distinctive bottom gradient: Emerald green on bottom-left blending to Royal Navy Blue on bottom-right.
 * - Prominent white serif typography for Doctor Name.
 * - Designation and Department underneath.
 * - Thin horizontal divider line.
 * - OPD Days row with [Mon] to [Sun] badges (active in bold dark text on white pill, inactive in teal/white pill).
 * - Clock icon with consultation timing.
 */
const DoctorCard = ({ doc, department, branch, location, theme }) => {
  if (!doc) return null;

  // Format Name: ensure clean Title/Dr. prefix
  let formattedName = doc.name ? String(doc.name).trim() : 'Doctor';
  if (!/^Dr\b/i.test(formattedName) && !/^Prof\b/i.test(formattedName)) {
    formattedName = `Dr. ${formattedName}`;
  }

  // Combine designation and department/specialty
  const docDept = doc.department_name || department || '';
  const designationAndDept = [doc.designation, docDept]
    .filter(Boolean)
    .join(', ');

  // Parse and resolve OPD display days
  let parsedDays = doc.display_days;
  if (typeof parsedDays === 'string') {
    try {
      parsedDays = JSON.parse(parsedDays);
    } catch {
      parsedDays = [parsedDays];
    }
  }

  let branchDays = [];
  if (Array.isArray(parsedDays)) {
    branchDays = parsedDays;
  } else if (parsedDays && typeof parsedDays === 'object') {
    const currentBranch = branch ? branch.toUpperCase() : 'SSCC';
    const currentLoc = (location || '').toLowerCase();
    const locKeyMatch = Object.keys(parsedDays).find(k => k.toLowerCase() === currentLoc);
    branchDays = locKeyMatch ? parsedDays[locKeyMatch] : (parsedDays[currentBranch] || []);
  }

  // Normalize active days set (e.g. 'mon', 'monday', 'MON' -> 'mon')
  const activeDaysSet = new Set(
    (Array.isArray(branchDays) ? branchDays : [branchDays])
      .map(d => String(d || '').trim().substring(0, 3).toLowerCase())
  );

  const timingText = doc.timing || '09:00 AM - 05:00 PM';

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] xl:max-w-[480px] aspect-[9/14] sm:aspect-[9/14.5] md:aspect-[9/15] h-full max-h-[76vh] sm:max-h-[80vh] md:max-h-[82vh] lg:max-h-[85vh] mx-auto rounded-[24px] sm:rounded-[30px] md:rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(0,104,55,0.18)] border-2 border-white/70 flex flex-col justify-end bg-slate-900">
      {/* ── 1. Blurred Clinic Corridor Background matching Images 1 & 2 ── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#d4f0ea] via-[#c6eae2] to-[#0ea5e9]">
        {/* Soft perspective lights & bokeh highlights recreating clinical hallway */}
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_75%_35%,_var(--tw-gradient-stops))] from-cyan-100 via-teal-200 to-transparent blur-md" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[75%] h-[50%] bg-white/35 rounded-full blur-2xl" />
      </div>

      {/* ── 2. Doctor Photograph / Avatar Center Stage ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pb-32 sm:pb-36 md:pb-40">
        {doc.photo_url ? (
          <img
            src={getFullPhotoUrl(doc.photo_url)}
            alt={doc.name}
            className="w-full h-full object-contain object-top drop-shadow-xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          /* Exact Frosted Circular Avatar Placeholder from Images 1 & 2 */
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white/35 backdrop-blur-md border-2 border-white/60 flex items-center justify-center shadow-lg transition-transform">
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-22 md:h-22 text-teal-800/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          </div>
        )}
      </div>

      {/* ── 3. Base Gradient Overlay (Emerald Green to Royal Navy Blue) ── */}
      <div
        className="relative z-20 w-full pt-10 sm:pt-12 pb-3.5 sm:pb-4 px-4 sm:px-6 flex flex-col items-center text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 168, 107, 0.94) 0%, rgba(14, 116, 144, 0.94) 45%, rgba(29, 78, 216, 0.96) 100%)',
        }}
      >
        {/* Doctor Name */}
        <h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white tracking-wide drop-shadow-md leading-tight"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          {formattedName}
        </h2>

        {/* Designation & Department */}
        {designationAndDept && (
          <p className="text-xs sm:text-sm md:text-base text-white/95 font-medium mt-0.5 sm:mt-1 tracking-wide drop-shadow-sm line-clamp-2">
            {designationAndDept}
          </p>
        )}

        {/* Thin Horizontal Divider */}
        <div className="w-full h-[1px] bg-white/40 my-2 sm:my-2.5" />

        {/* Bottom Row: OPD Days Badges (Left) & Consultation Timings (Right) */}
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2">
          {/* OPD Days Section */}
          <div className="flex flex-col items-start">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/90 font-semibold mb-0.5">
              OPD Days
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
              {DAYS.map((day) => {
                const isActive = activeDaysSet.has(day.toLowerCase());
                return (
                  <span
                    key={day}
                    className={`text-[9px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 py-0.5 rounded shadow-sm transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 font-bold'
                        : 'bg-white/85 text-teal-800 font-semibold'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Consultation Timings Section with Clock Icon */}
          <div className="flex items-center gap-1 text-white shrink-0 font-bold text-[11px] sm:text-xs md:text-sm drop-shadow-sm self-end pb-0.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 shrink-0" />
            <span className="whitespace-nowrap">{timingText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
