import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import type { ActionItem } from '../../types/notice';

interface ActionRequiredBannerProps {
  items: ActionItem[];
  onSelectNotice: (noticeId: string) => void;
}

export const ActionRequiredBanner: React.FC<ActionRequiredBannerProps> = ({
  items,
  onSelectNotice,
}) => {
  if (!items || items.length === 0) return null;

  // Duplicate items sufficiently to ensure a seamless -50% infinite loop on any screen width
  const repeatedItems = [...items, ...items, ...items, ...items];
  const tickerItems = [...repeatedItems, ...repeatedItems];

  return (
    <div className="w-full bg-[#00275a]/5 border-b border-[#e2e6ec] px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-3 overflow-hidden select-none">
      {/* Fixed Non-Scrolling Label on Left */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-[#00275a] font-bold text-[11px] sm:text-xs uppercase tracking-wider shrink-0 z-20 select-none bg-[#eff3f8] pr-1.5 sm:pr-2 shadow-xs sm:shadow-none">
        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ef4444] shrink-0" />
        <span className="whitespace-nowrap">Action Required:</span>
      </div>

      {/* Scrolling Ticker Track Container */}
      <div className="relative flex-1 overflow-hidden min-w-0">
        {/* Subtle gradient fades on edges for smooth appearance */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#f0f3f8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#f0f3f8] to-transparent z-10 pointer-events-none" />

        {/* Continuous Horizontal Marquee Track */}
        <div className="animate-action-ticker flex items-center gap-2 sm:gap-2.5">
          {tickerItems.map((item, idx) => {
            const isError = item.type === 'error';
            const isWarning = item.type === 'warning';

            return (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => onSelectNotice(item.noticeId)}
                className={`inline-flex items-center gap-2 bg-white border px-2.5 py-1 rounded-sm text-xs transition-all duration-150 group cursor-pointer shadow-2xs shrink-0 whitespace-nowrap ${
                  isError
                    ? 'border-red-200 hover:border-red-400 hover:bg-red-50/40'
                    : isWarning
                    ? 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/40'
                    : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                {/* Date Chip */}
                <span
                  className={`font-bold text-[11px] uppercase tracking-wide shrink-0 ${
                    isError
                      ? 'text-red-600'
                      : isWarning
                      ? 'text-amber-700'
                      : 'text-blue-700'
                  }`}
                >
                  {item.dateLabel}
                </span>

                {/* Title */}
                <span className="text-[#1c1b1b] group-hover:text-[#00275a] font-medium transition-colors">
                  {item.title}
                </span>

                {/* Arrow */}
                <ArrowRight className="w-3.5 h-3.5 text-[#737782] group-hover:text-[#00275a] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
