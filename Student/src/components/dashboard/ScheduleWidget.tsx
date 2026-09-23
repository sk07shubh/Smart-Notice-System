import React from 'react';
import { Calendar, BookOpen, ExternalLink } from 'lucide-react';

interface ScheduleWidgetProps {
  onNavigateView: (view: string) => void;
}

export const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ onNavigateView }) => (
  <div className="flex flex-col gap-3.5">
    <div className="bg-white p-2 border border-[#e2e6ec] rounded-lg flex gap-2 shadow-2xs">
      <button
        onClick={() => onNavigateView('notices')}
        className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-[#f5f7fa] hover:bg-[#eae7e7] border border-[#e2e6ec] rounded-sm transition-colors text-xs font-semibold text-[#1c1b1b]"
      >
        <BookOpen className="w-4 h-4 text-[#00696c]" />
        <span>Circulars</span>
      </button>
    </div>

    <div className="bg-white border border-[#e2e6ec] rounded-lg overflow-hidden shadow-2xs">
      <div className="bg-[#f6f3f2] border-b border-[#e2e6ec] p-3 flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-[#003c84]" />
        <h3 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wide">Timetable</h3>
      </div>
      <p className="p-3 text-xs text-[#5c6470]">No live timetable is available from the backend.</p>
      <button
        onClick={() => onNavigateView('timetable')}
        className="w-full p-2.5 text-center bg-[#f5f7fa] hover:bg-[#eae7e7] border-t border-[#e2e6ec] transition-colors cursor-pointer"
      >
        <span className="text-[11px] font-bold text-[#003c84] uppercase tracking-wider inline-flex items-center gap-1">
          Timetable status <ExternalLink className="w-3 h-3" />
        </span>
      </button>
    </div>
  </div>
);
