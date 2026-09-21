import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import type { Notice } from '../../types/notice';

interface ImportantNoticesProps {
  notices: Notice[];
  onSelectNotice: (id: string) => void;
}

export const ImportantNotices: React.FC<ImportantNoticesProps> = ({
  notices,
  onSelectNotice,
}) => {
  const importantItems = notices.filter((n) => n.important);

  if (importantItems.length === 0) return null;

  // Duplicate the list once for seamless 100% infinite marquee looping without visual glitch/reset
  const tickerItems = [...importantItems, ...importantItems];

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'text-[#00696c] bg-teal-50 border-teal-200';
      case 'Examination':
      case 'Exam':
        return 'text-[#b45309] bg-amber-50 border-amber-200';
      case 'Placement':
        return 'text-[#00275a] bg-blue-50 border-blue-200';
      case 'Administrative':
      case 'Admin':
        return 'text-[#4338ca] bg-indigo-50 border-indigo-200';
      case 'Events':
        return 'text-[#6d28d9] bg-purple-50 border-purple-200';
      default:
        return 'text-[#5c6470] bg-slate-50 border-slate-200';
    }
  };

  return (
    <section className="w-full max-w-full overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#1c1b1b]">Important Notices</h2>
        </div>
        <span className="text-[11px] text-[#5c6470] font-semibold bg-[#e2e6ec]/50 px-2 py-0.5 rounded-full">
          {importantItems.length} {importantItems.length === 1 ? 'priority circular' : 'priority circulars'}
        </span>
      </div>

      {/* Continuous Moving Bulletin / Ticker Area */}
      <div className="relative w-full overflow-hidden bg-white border border-amber-200/90 rounded-lg shadow-2xs group hover:border-[#003c84] transition-colors">
        {/* Left Priority Accent Line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b] z-20" />

        <div className="flex items-center min-h-[46px]">
          {/* Static Bulletin Header Tag on Left */}
          <div className="shrink-0 z-20 bg-amber-50/95 border-r border-amber-200 px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center gap-2 select-none shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-bold text-amber-900 tracking-wider uppercase whitespace-nowrap">
              Important Bulletin
            </span>
          </div>

          {/* Scrolling Ticker Track Container */}
          <div className="relative flex-1 overflow-hidden py-2 sm:py-2.5">
            {/* Subtle gradient fades on edges for smooth appearance */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Seamless Infinite Continuous Marquee Track */}
            <div className="animate-bulletin-ticker flex items-center">
              {tickerItems.map((notice, index) => (
                <div
                  key={`${notice.id}-${index}`}
                  onClick={() => onSelectNotice(notice.id)}
                  className="inline-flex items-center gap-2.5 px-4 text-xs font-medium cursor-pointer text-[#1c1b1b] hover:text-[#003c84] transition-colors group/item shrink-0 select-none"
                  title={`Click to view: ${notice.title}`}
                >
                  {/* Category Chip */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryStyles(
                      notice.category
                    )}`}
                  >
                    {notice.category}
                  </span>

                  {/* Urgent Chip */}
                  {notice.urgent && (
                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-red-200 shrink-0">
                      URGENT
                    </span>
                  )}

                  {/* Notice Subject / Title */}
                  <span className="font-semibold group-hover/item:text-[#003c84] group-hover/item:underline truncate max-w-xs sm:max-w-md md:max-w-lg transition-colors">
                    {notice.title}
                  </span>

                  {/* Date Stamp */}
                  <span className="text-[11px] text-[#737782] font-normal shrink-0">
                    ({notice.date.split(',')[0]})
                  </span>

                  {/* Interactive Arrow Indicator */}
                  <ChevronRight className="w-3.5 h-3.5 text-[#737782] group-hover/item:text-[#003c84] group-hover/item:translate-x-0.5 transition-all shrink-0" />

                  {/* Separator Dot Between Bulletins */}
                  <span className="text-[#cbd5e1] font-bold ml-2 select-none shrink-0">
                    •
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

