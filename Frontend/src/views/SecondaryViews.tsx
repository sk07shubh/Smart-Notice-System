import React from 'react';
import { 
  Clock, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { mockScheduleItems } from '../data/mockNotices';

interface GenericViewProps {
  onNavigateNotice: (id: string) => void;
  onNavigateView?: (view: string) => void;
}

export const TimetableView: React.FC<GenericViewProps> = ({ onNavigateView }) => (
  <div className="max-w-5xl mx-auto p-3.5 sm:p-6 flex flex-col gap-4 sm:gap-5">
    {onNavigateView && (
      <button
        onClick={() => onNavigateView('dashboard')}
        className="self-start flex items-center gap-1.5 text-xs text-[#003c84] font-semibold hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Notices</span>
      </button>
    )}

    <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e6ec] shadow-2xs">
      <h1 className="text-lg sm:text-xl font-bold text-[#1c1b1b] flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#003c84]" /> Weekly Academic Timetable
      </h1>
      <p className="text-xs text-[#5c6470] mt-1">Computer Engineering • Semester I (AY 2023-24)</p>
    </div>

    <div className="bg-white rounded-xl border border-[#e2e6ec] overflow-hidden shadow-2xs">
      <div className="p-3.5 sm:p-4 bg-[#f8fafc] border-b border-[#e2e6ec] flex justify-between items-center">
        <span className="font-bold text-xs text-[#00275a] uppercase tracking-wider">Tuesday Schedule (Current)</span>
        <span className="text-xs text-[#5c6470] font-medium">Room 304 & Labs</span>
      </div>
      <div className="divide-y divide-[#e2e6ec]">
        {mockScheduleItems.map((item) => (
          <div key={item.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 hover:bg-[#f8fafc] transition-colors">
            <div className="w-24 shrink-0 font-bold text-xs sm:text-sm text-[#00275a]">
              {item.time} {item.period}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm text-[#1c1b1b]">{item.subject}</h4>
              <p className="text-[11px] sm:text-xs text-[#5c6470] mt-0.5">{item.details}</p>
            </div>
            <span className="self-start text-[10px] sm:text-[11px] uppercase font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded shrink-0">
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const EventsView: React.FC<GenericViewProps> = ({ onNavigateNotice, onNavigateView }) => (
  <div className="max-w-5xl mx-auto p-3.5 sm:p-6 flex flex-col gap-4 sm:gap-5">
    {onNavigateView && (
      <button
        onClick={() => onNavigateView('dashboard')}
        className="self-start flex items-center gap-1.5 text-xs text-[#003c84] font-semibold hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Notices</span>
      </button>
    )}

    <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e6ec] shadow-2xs">
      <h1 className="text-lg sm:text-xl font-bold text-[#1c1b1b] flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#003c84]" /> Campus Events & Technical Festivals
      </h1>
      <p className="text-xs text-[#5c6470] mt-1">Upcoming cultural, sports, and technical competitions</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      <div 
        onClick={() => onNavigateNotice('notice-10')}
        className="bg-white rounded-xl border border-[#e2e6ec] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="h-36 sm:h-40 bg-[#00275a] relative flex items-end p-4 text-white">
          <div>
            <span className="text-[10px] font-bold text-[#43ccd1] uppercase">Technical Fest</span>
            <h3 className="text-base sm:text-lg font-bold">Innovate '24 - National Symposium</h3>
          </div>
        </div>
        <div className="p-3.5 sm:p-4 text-xs text-[#434751] space-y-2">
          <p>Annual engineering festival featuring Hackathon, RoboWars, Paper Presentations and more.</p>
          <div className="flex justify-between items-center pt-2 text-[#003c84] font-semibold">
            <span>Nov 15-17, 2023</span>
            <span>View Circular →</span>
          </div>
        </div>
      </div>

      <div 
        onClick={() => onNavigateNotice('notice-5')}
        className="bg-white rounded-xl border border-[#e2e6ec] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="h-36 sm:h-40 bg-sky-900 relative flex items-end p-4 text-white">
          <div>
            <span className="text-[10px] font-bold text-amber-300 uppercase">Sports Tournament</span>
            <h3 className="text-base sm:text-lg font-bold">Inter-Department Basketball & Futsal</h3>
          </div>
        </div>
        <div className="p-3.5 sm:p-4 text-xs text-[#434751] space-y-2">
          <p>Selection trials for the university tournament open for all years.</p>
          <div className="flex justify-between items-center pt-2 text-[#003c84] font-semibold">
            <span>Oct 27-28, 2023</span>
            <span>View Circular →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
