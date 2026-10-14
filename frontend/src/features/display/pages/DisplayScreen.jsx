import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MonitorPlay } from 'lucide-react';
import { useAuth } from '../../../app/context/AuthContext';
import { getBranchConfig } from '../config/branchRegistry';
import { useDisplayPlaylist } from '../hooks/useDisplayPlaylist';
import DisplayHeader from '../components/DisplayHeader';
import DisplayFooter from '../components/DisplayFooter';
import DoctorCard from '../components/DoctorCard';
import welcomeSscc from '../../../common/assets/welcome-sscc.png';
import welcomePbmh from '../../../common/assets/welcome-pbmh.png';
import bannerImg from '../../../common/assets/Banner.jpeg';
import kioskStandBg from '../../../common/assets/kiosk-stand-bg.jpg';

const WELCOME_DURATION_MS = 2000; // 2 seconds welcome screen
const DOCTOR_DURATION_MS = 3000;  // 3 seconds per individual doctor

const formatLocationForUrl = (loc) => {
  if (!loc) return '';
  return loc.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-');
};

// ─── Inject display-screen CSS once ──────────────────────────────────────────
const injectDisplayStyles = () => {
  const style = document.createElement('style');
  style.id = 'display-screen-styles';
  style.innerHTML = `
    body, html {
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      background-color: #f0f9f6;
      width: 100vw;
      height: 100vh;
    }
    ::-webkit-scrollbar { display: none !important; }
  `;
  if (!document.getElementById('display-screen-styles')) {
    document.head.appendChild(style);
  }
  return () => {
    const el = document.getElementById('display-screen-styles');
    if (el) el.remove();
  };
};

const DisplayScreen = () => {
  const { branch: paramBranch, location: paramLocation } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, getAssignedLocations, branches, branchLocations } = useAuth();

  const branch = paramBranch || searchParams.get('branch');
  const location = paramLocation || searchParams.get('location');
  const assignedLocs = getAssignedLocations() || [];

  // Resolve branch configuration
  const config = getBranchConfig(branch);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Data & Real-time engine (Socket.IO + SSE)
  const { pages, playlist, loading, error } = useDisplayPlaylist(branch, location);

  // ── Welcome Screen Lifecycle ────────────────────────────────────────────────
  // Shown for 2s once per display session; routine roster refreshes NEVER restart it
  const welcomeShownRef = useRef(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const branchKey = (branch || '').toLowerCase();
  const welcomeImage = useMemo(() => {
    if (branchKey === 'sscc') return welcomeSscc;
    if (branchKey === 'pbmh' || branchKey === 'kims') return welcomePbmh;
    return config?.welcomeImage || null;
  }, [branchKey, config]);

  useEffect(() => {
    if (welcomeShownRef.current || !welcomeImage) {
      setShowWelcome(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowWelcome(false);
      welcomeShownRef.current = true;
    }, WELCOME_DURATION_MS);

    return () => clearTimeout(timer);
  }, [welcomeImage]);

  const isWelcomeActive = (showWelcome || loading) && !welcomeShownRef.current && Boolean(welcomeImage);

  // Redirect to valid default location if none provided in URL
  useEffect(() => {
    if (!branch || !location) {
      if (user && user.role === 'normal_admin' && assignedLocs.length > 0) {
        const { branch: tb, location: tl } = assignedLocs[0];
        navigate(`/display/${formatLocationForUrl(tb)}/${formatLocationForUrl(tl)}`, { replace: true });
      } else if (branches && branches.length > 0) {
        const targetBranch = branches.find(b => b.toUpperCase() === 'SSCC') || branches[0];
        const targetLoc = (branchLocations?.[targetBranch]?.[0]) || 'main';
        navigate(`/display/${formatLocationForUrl(targetBranch)}/${formatLocationForUrl(targetLoc)}`, { replace: true });
      }
    }
  }, [branch, location, user, assignedLocs, branches, branchLocations, navigate]);

  // Global styles injection
  useEffect(() => {
    if (branch && location) return injectDisplayStyles();
  }, [branch, location]);

  // ── Unroll / Flatten pages to guarantee EXACTLY ONE doctor per item ─────────
  const displayPages = useMemo(() => {
    const list = [];
    (pages || []).forEach(page => {
      if (page.isVideo || page.isBanner) {
        list.push(page);
      } else if (page.doctors && page.doctors.length > 0) {
        page.doctors.forEach(doc => {
          list.push({
            ...page,
            doctor: doc,
            doctors: [doc],
            duration: DOCTOR_DURATION_MS / 1000,
          });
        });
      } else if (page.doctor) {
        list.push({
          ...page,
          duration: DOCTOR_DURATION_MS / 1000,
        });
      } else {
        list.push(page);
      }
    });
    return list;
  }, [pages]);

  // Bounds check for index on real-time roster update
  useEffect(() => {
    if (displayPages.length === 0) {
      setCurrentPageIndex(0);
    } else if (currentPageIndex >= displayPages.length) {
      setCurrentPageIndex(0);
    }
  }, [displayPages, currentPageIndex]);

  // ── Auto-advance rotation timer (3s per doctor) ─────────────────────────────
  useEffect(() => {
    if (isWelcomeActive) return; // Do not advance in background during welcome screen
    if (displayPages.length <= 1) return;

    const currentPage = displayPages[currentPageIndex];
    const goToNext = () => setCurrentPageIndex(prev => (prev + 1) % displayPages.length);

    const durationMs = currentPage?.isVideo
      ? (Number(currentPage.duration || 10) + 30) * 1000
      : (currentPage?.doctor ? DOCTOR_DURATION_MS : (currentPage?.duration || 3) * 1000);

    const timer = setTimeout(goToNext, durationMs);
    return () => clearTimeout(timer);
  }, [currentPageIndex, displayPages, isWelcomeActive]);

  // ── Loading / Error states (fallback when no welcome screen) ────────────────
  if (!branch || !location || (loading && !isWelcomeActive)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f0f9f6]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#006837]" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f0f9f6] text-[#006837] px-4 text-center">
        <h2 className="text-2xl font-bold font-serif">{error || 'No playlist found for this screen.'}</h2>
        <p className="mt-2 text-slate-600">Please configure the display in the admin panel.</p>
      </div>
    );
  }

  const currentPage = displayPages[currentPageIndex];
  const currentDoctor = currentPage?.doctor || currentPage?.doctors?.[0] || null;
  const goToNext = () => setCurrentPageIndex(prev => (prev + 1) % displayPages.length);
  const isContentPage = !currentPage?.isBanner && !currentPage?.isVideo;

  return (
    <div className={`h-screen w-screen max-h-screen max-w-screen overflow-hidden flex flex-col font-sans text-slate-900 relative ${currentPage?.isVideo ? 'bg-black' : currentPage?.isBanner ? 'bg-white' : 'bg-[#f0f9f6]'} select-none`}>
      {/* ── Welcome Screen (Shown for 2s once on session init) ──────────────── */}
      <AnimatePresence mode="wait">
        {isWelcomeActive && welcomeImage && (
          <motion.div
            key="branch-welcome-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
          >
            <img
              src={welcomeImage}
              alt={`${branch} Welcome Screen`}
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Authentic Medical Pattern & Concentric Framing Arch Backdrop (Doctor Roster Pages Only) ── */}
      {isContentPage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img
            src={kioskStandBg}
            alt="Hospital Display Backdrop"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* ── Hospital Header matching Images 1 & 2 ──────────────────────────── */}
      {isContentPage && <DisplayHeader theme={config.theme} branch={branch} />}

      {/* ── Main Stage Area (Responsively fits inside remaining height) ─────── */}
      <main className={`flex-1 min-h-0 flex flex-col items-center justify-center z-10 overflow-hidden w-full ${isContentPage ? 'px-3 sm:px-6 py-0.5 sm:py-1' : 'p-0'}`}>
        {/* Video Step */}
        {currentPage?.isVideo && (
          <div className="flex-1 flex items-center justify-center overflow-hidden bg-black h-full w-full rounded-2xl">
            <video
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                  el.play().catch((err) => {
                    console.warn('[DisplayScreen] Autoplay deferred:', err);
                  });
                }
              }}
              src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : window.location.origin}${currentPage.videoUrl}`}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={goToNext}
              onError={(e) => {
                console.error('[DisplayScreen] Video playback error for URL:', currentPage.videoUrl, e);
                goToNext();
              }}
            />
          </div>
        )}

        {/* Promotional Banner Step */}
        {currentPage?.isBanner && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`banner-page-${currentPageIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center justify-center overflow-hidden min-h-0 w-full h-full bg-white"
            >
              <img
                src={bannerImg}
                alt="KIMS Banner"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Exactly One Doctor Card at a time matching Images 1 & 2 */}
        {isContentPage && currentDoctor && (
          <div className="w-full h-full flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`doctor-${currentPageIndex}-${currentDoctor.id || currentDoctor.name || 'card'}`}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full h-full flex items-center justify-center"
              >
                <DoctorCard
                  doc={currentDoctor}
                  department={currentPage?.department}
                  branch={branch}
                  location={location}
                  theme={config.theme}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Empty State when no doctors scheduled */}
        {isContentPage && !currentDoctor && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10">
            <div className="w-20 h-20 mb-3 opacity-25">
              <MonitorPlay className="w-full h-full text-[#006837]" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-[#006837]">
              No Schedules Available
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-md">
              There are no doctors scheduled for today at this location.
            </p>
          </div>
        )}
      </main>

      {/* ── Hospital Footer matching Images 1 & 2 ──────────────────────────── */}
      {isContentPage && <DisplayFooter theme={config.theme} />}
    </div>
  );
};

export default DisplayScreen;
