import React, { useState } from 'react';
import {
  FileText,
  HelpCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
import type { RecentUpdate } from '../../types/notice';
import { DocsModal } from '../modals/DocsModal';
import { HelpModal } from '../modals/HelpModal';

interface RecentUpdatesWidgetProps {
  updates?: RecentUpdate[];
  onSelectNotice?: (noticeId: string) => void;
}

export const RecentUpdatesWidget: React.FC<RecentUpdatesWidgetProps> = ({
  updates = [],
  onSelectNotice,
}) => {
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleUpdateClick = (update: RecentUpdate) => {
    if (update.noticeId && onSelectNotice) {
      onSelectNotice(update.noticeId);
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Top Tabs: Docs | Help (Removed Circulars) */}
      <div className="bg-white p-2 border border-[#e2e6ec] rounded-lg flex gap-2 shadow-2xs">
        <button
          onClick={() => setShowDocsModal(true)}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-[#f8fafc] hover:bg-[#eae7e7] border border-[#e2e6ec] rounded-sm transition-colors text-xs font-semibold text-[#1c1b1b] cursor-pointer shadow-2xs"
          title="Download official college documents and forms"
        >
          <FileText className="w-4 h-4 text-[#003c84]" />
          <span>Docs</span>
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-[#f8fafc] hover:bg-[#eae7e7] border border-[#e2e6ec] rounded-sm transition-colors text-xs font-semibold text-[#1c1b1b] cursor-pointer shadow-2xs"
          title="Portal guidance and student helpdesk"
        >
          <HelpCircle className="w-4 h-4 text-[#003c84]" />
          <span>Help</span>
        </button>
      </div>

      {/* Recent Updates Card (Preserves exact structure, dimensions, shadows of timetable card) */}
      <div className="bg-white border border-[#e2e6ec] rounded-lg overflow-hidden shadow-2xs flex flex-col">
        {/* Card Header */}
        <div className="bg-[#f8fafc] border-b border-[#e2e6ec] p-3 flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#003c84]" />
            Recent Updates
          </h3>
          <span className="text-[10px] text-[#00696c] font-semibold bg-[#75f6fb]/20 border border-[#43ccd1]/30 px-2 py-0.5 rounded-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00696c] animate-pulse" />
            Live Feed
          </span>
        </div>

        {/* List of Updates */}
        <ul className="flex flex-col divide-y divide-[#e2e6ec]">
          {updates.length === 0 && <li className="p-4 text-xs text-[#5c6470]">No live notice updates available.</li>}
          {updates.map((update) => (
            <li
              key={update.id}
              onClick={() => handleUpdateClick(update)}
              className="p-3 flex items-start gap-2.5 hover:bg-[#f8fafc] transition-colors cursor-pointer group"
            >
              {/* Bullet Indicator */}
              <div className="mt-1 shrink-0">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${update.isUrgent ? 'bg-[#f59e0b]' : 'bg-[#003c84]'
                    }`}
                />
              </div>

              {/* Title & Department / Time */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-[13px] font-semibold text-[#1c1b1b] group-hover:text-[#003c84] transition-colors leading-snug line-clamp-1">
                  {update.title}
                </h4>
                <p className="text-[11px] text-[#5c6470] mt-0.5 flex items-center gap-1.5 truncate">
                  <span>{update.department}</span>
                  <span className="text-[#c3c6d2]">·</span>
                  <span className="font-medium text-[#737782]">{update.timeAgo}</span>
                </p>
              </div>

              {/* Subtle indicator */}
              <div className="shrink-0 text-[#737782] group-hover:text-[#003c84] group-hover:translate-x-0.5 transition-transform mt-0.5">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Docs Modal */}
      <DocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};
