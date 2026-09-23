import React from 'react';
import { Clock, Sparkles, ArrowLeft } from 'lucide-react';

interface GenericViewProps {
  onNavigateNotice: (id: string) => void;
  onNavigateView?: (view: string) => void;
}

interface UnavailableViewProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onNavigateView?: (view: string) => void;
}

const UnavailableView: React.FC<UnavailableViewProps> = ({ title, description, icon, onNavigateView }) => (
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
        {icon} {title}
      </h1>
      <p className="text-xs text-[#5c6470] mt-1">{description}</p>
    </div>
  </div>
);

export const TimetableView: React.FC<GenericViewProps> = ({ onNavigateView }) => (
  <UnavailableView
    title="Timetable"
    description="A live timetable is not currently provided by the backend."
    icon={<Clock className="w-5 h-5 text-[#003c84]" />}
    onNavigateView={onNavigateView}
  />
);

export const EventsView: React.FC<GenericViewProps> = ({ onNavigateView }) => (
  <UnavailableView
    title="Campus Events & Technical Festivals"
    description="A live event feed is not currently provided by the backend. Published event notices appear in the notice feed."
    icon={<Sparkles className="w-5 h-5 text-[#003c84]" />}
    onNavigateView={onNavigateView}
  />
);
