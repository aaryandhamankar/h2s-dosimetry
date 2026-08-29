'use client';

import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X, Share2, PlusSquare } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export function FullscreenToggle({ className = '' }: { className?: string }) {
  const mounted = useMounted();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const handleFullscreenChange = () => {
      const doc = document as FullscreenDocument;
      const active = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(active);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [mounted]);

  const toggleFullscreen = async () => {
    if (typeof window === 'undefined') return;

    const doc = document as FullscreenDocument;
    const docEl = document.documentElement as FullscreenElement;

    // Check for iOS Safari (which restricts document requestFullscreen on standard web pages)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone;

    if (isIos && !isStandalone && !docEl.requestFullscreen && !docEl.webkitRequestFullscreen) {
      setShowIosPrompt(true);
      return;
    }

    try {
      if (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      } else {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        } else if (isIos) {
          setShowIosPrompt(true);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request could not be completed:', err);
      if (isIos) {
        setShowIosPrompt(true);
      }
    }
  };

  if (!mounted) {
    return (
      <div className={`px-2 py-0.5 rounded border border-[#D5D2C9] bg-white text-[#596158] opacity-50 flex items-center gap-1 ${className}`}>
        <Maximize2 size={11} />
        <span className="text-[10px] sm:text-[11px] font-semibold">Full Screen</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleFullscreen}
        className={`px-2 py-0.5 rounded border transition-all flex items-center gap-1 shadow-2xs font-semibold cursor-pointer active:scale-95 ${
          isFullscreen
            ? 'bg-[#5C822D] text-white border-[#35551F]'
            : 'bg-white text-[#263026] border-[#D5D2C9] hover:bg-[#F0EFE9]'
        } ${className}`}
        title={isFullscreen ? 'Exit Full Screen Mode' : 'Enter Full Screen Mode (Hide Browser Bars)'}
        aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        aria-pressed={isFullscreen}
      >
        {isFullscreen ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
        <span className="text-[10px] sm:text-[11px]">
          {isFullscreen ? 'Exit Full' : 'Full Screen'}
        </span>
      </button>

      {/* iOS Safari "Add to Home Screen" instructions modal */}
      {showIosPrompt && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIosPrompt(false)}
        >
          <div 
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#E8E2D5] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <div className="flex items-center gap-2 text-[#35551F] font-bold text-[15px]">
                <Maximize2 size={18} className="text-[#5C822D]" />
                <span>Full Screen App Mode</span>
              </div>
              <button
                onClick={() => setShowIosPrompt(false)}
                className="p-1 text-[#7A8178] hover:text-[#263026] rounded-md transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-[#596158] leading-relaxed">
              To hide all Safari browser bars and run this portal in full screen without screen cut-ins:
            </p>

            <div className="space-y-2.5 bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] text-[12.5px] text-[#263026]">
              <div className="flex items-start gap-2.5">
                <span className="bg-[#EDF3E4] text-[#35551F] font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the Safari <strong>Share button</strong> (<Share2 size={13} className="inline text-[#5C822D]" />) at the bottom.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-[#EDF3E4] text-[#35551F] font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down and tap <strong>&apos;Add to Home Screen&apos;</strong> (<PlusSquare size={13} className="inline text-[#5C822D]" />).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-[#EDF3E4] text-[#35551F] font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Open the app from your home screen for a <strong>100% borderless</strong> experience!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIosPrompt(false)}
              className="gov-btn-primary w-full h-10 text-[13px] font-bold rounded-lg"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
