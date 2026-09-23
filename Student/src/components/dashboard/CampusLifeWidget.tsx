import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * The backend has no dedicated campus-life endpoint. Keep this component
 * truthful if it is added back to a dashboard: events are published as live
 * notices and banners instead of displaying a fabricated registration card.
 */
export const CampusLifeWidget: React.FC = () => (
  <div className="border border-[#e2e6ec] rounded-lg p-3.5 bg-white shadow-2xs">
    <div className="flex items-center gap-1.5 text-[#003c84]">
      <Sparkles className="w-4 h-4" />
      <span className="text-xs font-bold uppercase tracking-wide">Campus life</span>
    </div>
    <p className="mt-2 text-xs text-[#5c6470]">Live campus events are published in the notice feed and banner ticker.</p>
  </div>
);
