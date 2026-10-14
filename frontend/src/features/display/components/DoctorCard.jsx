import React from 'react';
import { Clock, User } from 'lucide-react';
import corridorBg from '../../../common/assets/doctor-corridor-extracted.png';

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
    <div className="relative w-full max-w-[360px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[560px] xl:max-w-[620px] aspect-[9/15.2] sm:aspect-[9/15.5] md:aspect-[9/15.8] h-full max-h-[85vh] sm:max-h-[87vh] md:max-h-[89vh] mx-auto rounded-[26px] sm:rounded-[32px] md:rounded-[38px] overflow-hidden shadow-[0_25px_60px_rgba(0,104,55,0.22)] border-[2.5px] border-white/85 flex flex-col bg-slate-900">
      {/* ── UPPER SECTION: Doctor Photo Stage with Authentic Clinical Corridor ── */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden flex items-end justify-center bg-[#dcf3ed]">
        {/* Authentic Clinical Corridor Backdrop extracted from hospital totem source template */}
        <img
          src={corridorBg}
          alt="Clinical Corridor Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        />

        {doc.photo_url ? (
          <img
            src={`${getFullPhotoUrl(doc.photo_url)}?v=${doc.updated_at || Date.now()}`}
            alt={doc.name}
            className="w-full h-full object-contain object-bottom drop-shadow-md z-10 transition-transform duration-300 relative"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          /* Frosted Circular Avatar Placeholder for when no photo is uploaded */
          <div className="z-10 my-auto w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white/40 backdrop-blur-md border-2 border-white/70 flex items-center justify-center shadow-lg relative">
            <svg
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 text-teal-800/40"
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

      {/* ── LOWER SECTION: Compact Doctor Details (~25% height) ── */}
      <div
        className="relative z-20 w-full shrink-0 px-4 sm:px-6 md:px-7 py-2.5 sm:py-3.5 flex flex-col justify-center text-center"
        style={{
          background: 'linear-gradient(135deg, #00934d 0%, #007d75 42%, #1b4d9b 100%)',
        }}
      >
        {/* Doctor Name & Designation */}
        <div className="w-full flex flex-col items-center justify-center">
          <h2
            className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-serif font-bold text-white tracking-wide drop-shadow leading-snug"
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          >
            {formattedName}
          </h2>

          {designationAndDept && (
            <p className="text-[11px] sm:text-xs md:text-sm text-white/95 font-medium mt-0.5 tracking-wide drop-shadow-sm line-clamp-2">
              {designationAndDept}
            </p>
          )}
        </div>

        {/* Thin Divider Line with compact margins */}
        <div className="w-full h-[1px] bg-white/30 my-2 sm:my-2.5" />

        {/* Bottom Row: OPD Days Badges & Consultation Timing */}
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2">
          {/* OPD Days Section */}
          <div className="flex flex-col items-start">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider text-white/90 font-semibold mb-0.5">
              OPD Days
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
              {DAYS.map((day) => {
                const isActive = activeDaysSet.has(day.toLowerCase());
                return (
                  <span
                    key={day}
                    className={`text-[8px] sm:text-[9px] md:text-[10px] px-1 sm:px-1.5 py-0.5 rounded shadow-sm transition-all ${
                      isActive
                        ? 'bg-white text-[#006837] font-bold shadow-md'
                        : 'bg-white/60 text-slate-900 font-semibold'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Consultation Timings Section with Clock Icon */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-white shrink-0 font-bold text-[10px] sm:text-xs md:text-sm drop-shadow-sm self-end">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/95 shrink-0" />
            <span className="whitespace-nowrap font-medium">{timingText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
