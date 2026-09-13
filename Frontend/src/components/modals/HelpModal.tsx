import React from 'react';
import { 
  X, 
  HelpCircle, 
  Search, 
  Paperclip, 
  Mail, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-[#e2e6ec] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-[#00275a] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center text-[#43ccd1]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notice Portal Help & Support</h3>
              <p className="text-[11px] text-slate-300">Quick guides and student helpdesk assistance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs text-[#1c1b1b]">
          {/* Quick Guidance Cards */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-[#5c6470] uppercase tracking-wider">
              Quick Guide
            </h4>

            {/* How to search */}
            <div className="p-3 bg-[#f8fafc] border border-[#e2e6ec] rounded-lg flex gap-2.5 items-start">
              <Search className="w-4 h-4 text-[#003c84] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-[#1c1b1b]">Finding & Filtering Notices</h5>
                <p className="text-[11px] text-[#5c6470] mt-0.5 leading-relaxed">
                  Use the top search bar (<kbd className="bg-white border px-1 rounded font-mono">Ctrl+K</kbd>) or category pills (Academic, Examination, Placement, Events, Administrative) to quickly find relevant circulars.
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div className="p-3 bg-[#f8fafc] border border-[#e2e6ec] rounded-lg flex gap-2.5 items-start">
              <Paperclip className="w-4 h-4 text-[#00696c] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-[#1c1b1b]">Previewing & Downloading Attachments</h5>
                <p className="text-[11px] text-[#5c6470] mt-0.5 leading-relaxed">
                  Click any notice with an attachment indicator to view the full circular, preview documents in the modal viewer, or download PDF / Excel schedules.
                </p>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="p-3 bg-[#f8fafc] border border-[#e2e6ec] rounded-lg flex gap-2.5 items-start">
              <Mail className="w-4 h-4 text-[#003c84] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-[#1c1b1b]">Email Notifications</h5>
                <p className="text-[11px] text-[#5c6470] mt-0.5 leading-relaxed">
                  Subscribe with your email address in the left sidebar to receive priority alerts and official announcements directly in your inbox.
                </p>
              </div>
            </div>
          </div>

          {/* Helpdesk Contacts */}
          <div className="space-y-2.5 pt-2 border-t border-[#e2e6ec]">
            <h4 className="text-[11px] font-bold text-[#5c6470] uppercase tracking-wider">
              Student Helpdesk Contacts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white border border-[#e2e6ec] rounded-lg flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#003c84] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#5c6470]">Official Support Email</p>
                  <p className="font-semibold text-[#1c1b1b] truncate">support@indiraicem.ac.in</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-[#e2e6ec] rounded-lg flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#003c84] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#5c6470]">Toll-Free Helpline</p>
                  <p className="font-semibold text-[#1c1b1b]">020-66759400 / 1800-233-042</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-[#e2e6ec] rounded-lg flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#003c84] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#5c6470]">Student Section Counter</p>
                  <p className="font-semibold text-[#1c1b1b]">Block B, Room 304</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-[#e2e6ec] rounded-lg flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#003c84] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#5c6470]">Operating Hours</p>
                  <p className="font-semibold text-[#1c1b1b]">10:00 AM - 04:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#e2e6ec] bg-[#f8fafc] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003c84] hover:bg-[#00275a] text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-2xs"
          >
            Close Help
          </button>
        </div>
      </div>
    </div>
  );
};
