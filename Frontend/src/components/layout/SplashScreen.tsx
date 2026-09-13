import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 800,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Smooth timer for initial splash entrance
    const timer = setTimeout(() => {
      setIsFading(true);
      // Wait for CSS fade out transition (400ms) before complete unmount
      const finishTimer = setTimeout(() => {
        setIsVisible(false);
        if (onFinish) onFinish();
      }, 400);

      return () => clearTimeout(finishTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc] transition-opacity duration-400 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-busy={!isFading}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Official College Logo */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-2 rounded-xl shadow-xs border border-[#e2e6ec] flex items-center justify-center mb-4">
          <img
            src="/indira-logo.png"
            alt="Indira College of Engineering & Management Logo"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        {/* Portal Name & Institution Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#00275a] tracking-tight">
          ICEM Notice Portal
        </h1>
        <p className="text-[11px] sm:text-xs text-[#5c6470] font-semibold uppercase tracking-wider mt-1">
          Indira College of Engineering & Management
        </p>

        {/* Subtle Loading Progress Indicator */}
        <div className="w-36 sm:w-44 h-1 bg-[#e2e6ec] rounded-full overflow-hidden mt-6 relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#003c84] to-[#43ccd1] rounded-full w-full animate-loading-bar" />
        </div>

        <span className="text-[11px] text-[#737782] font-medium mt-2.5">
          Loading notices...
        </span>
      </div>
    </div>
  );
};
