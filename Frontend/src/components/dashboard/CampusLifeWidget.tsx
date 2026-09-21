import React, { useState } from 'react';
import { Sparkles, CheckCircle, Calendar, MapPin, X } from 'lucide-react';

export const CampusLifeWidget: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [registered, setRegistered] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="border border-[#e2e6ec] rounded-lg overflow-hidden relative h-36 group cursor-pointer shadow-2xs"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-3.5 w-full flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-teal-300 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> CAMPUS LIFE
            </p>
            <p className="text-sm font-bold text-white leading-tight">TechSymposium & Hackathon '24</p>
            <p className="text-[11px] text-slate-300">Registrations closing soon</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="bg-[#003c84] hover:bg-[#43ccd1] text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm shadow-sm transition-colors shrink-0"
          >
            {registered ? 'Registered ✓' : 'Register'}
          </button>
        </div>
      </div>

      {/* Registration / Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-[#e2e6ec]">
            <div className="relative h-36 bg-[#00275a] p-4 text-white flex flex-col justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#43ccd1] uppercase tracking-wider">ICEM Annual Fest</span>
              <h3 className="text-lg font-bold text-white">TechSymposium & Innovate '24</h3>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-[#1c1b1b]">
              <div className="flex items-center gap-2 text-[#5c6470]">
                <Calendar className="w-4 h-4 text-[#003c84]" />
                <span>November 15-17, 2023</span>
              </div>
              <div className="flex items-center gap-2 text-[#5c6470]">
                <MapPin className="w-4 h-4 text-[#003c84]" />
                <span>ICEM Main Campus & Engineering Quad</span>
              </div>

              <p className="leading-relaxed text-[#434751]">
                Participate in over 15+ engineering competitions including 24-Hour CodeSprint, RoboWars, Drone Racing, and Project Exhibition with prize pool exceeding ₹2,50,000.
              </p>

              {registered ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-sm flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>You have successfully registered for TechSymposium '24! Pass will be sent to your student email.</span>
                </div>
              ) : (
                <button
                  onClick={() => setRegistered(true)}
                  className="w-full py-2.5 bg-[#003c84] hover:bg-[#43ccd1] text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
                >
                  Confirm Student Registration
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
