import React, { useState } from 'react';

interface AdminSidebarProps {
  currentTab?: string;
  onNavigateTab?: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSwitchToStudentPortal?: () => void;
  totalNoticesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab = 'manage-notices',
  onNavigateTab,
  isOpen,
  onClose,
  onSwitchToStudentPortal,
  totalNoticesCount = 24,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', badge: totalNoticesCount },
    { id: 'create-notice', label: 'Create Notice', icon: 'edit_note' },
    { id: 'manage-banner', label: 'Dashboard Banner', icon: 'view_carousel' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Left Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e2e6ec] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between gap-3 bg-white border-b border-[#e2e6ec]/70">
            <div className="flex items-center gap-3">
              <img
                src="/indira-logo.png"
                alt="ICEM Institutional Emblem"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-[#00275a] tracking-tight leading-none">ICEM</span>
                  <span className="text-[10px] font-bold uppercase bg-[#003c84] text-white px-1.5 py-0.5 rounded leading-none">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-[#5c6470] leading-tight mt-0.5 font-medium">
                  Notice Management
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#5c6470] hover:text-[#1c1b1b] rounded cursor-pointer"
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Section Label */}
          <div className="px-4 pt-4 pb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c6470]">
              Navigation
            </span>
          </div>

          {/* Primary Navigation Items */}
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isDashboard = currentTab === 'dashboard' || currentTab === 'admin-dashboard' || currentTab === 'manage-notices';
              const isActive = item.id === 'dashboard' ? isDashboard : currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#d8e2ff] text-[#001a41] font-semibold shadow-xs'
                      : 'text-[#434751] hover:bg-[#eae7e7]/60 hover:text-[#1c1b1b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#00275a]' : 'text-[#737782]'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#f0eded] text-[#00275a]'
                          : 'bg-[#f0eded] text-[#5c6470]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Profile / Account & System Status */}
        <div className="p-3 bg-white border-t border-[#e2e6ec]/80 flex flex-col gap-2 relative">
          {/* Profile Dropdown Popup */}
          {profileMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white shadow-xl rounded-lg py-2 flex flex-col z-50 border border-[#e2e6ec] animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3.5 py-2 bg-[#f6f3f2] border-b border-[#e2e6ec]/60">
                <span className="text-xs font-bold text-[#00275a] uppercase tracking-wider block">Admin Account</span>
                <span className="text-xs text-[#5c6470] block truncate">admin.tpo@icem.ac.in</span>
              </div>
              <button
                onClick={() => setProfileMenuOpen(false)}
                className="px-3.5 py-2 text-[#434751] hover:bg-[#eae7e7]/70 hover:text-[#1c1b1b] flex items-center gap-2 text-xs text-left w-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                <span>Profile &amp; Settings</span>
              </button>
              {onSwitchToStudentPortal && (
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onSwitchToStudentPortal();
                  }}
                  className="px-3.5 py-2 text-[#00696c] hover:bg-[#75f6fb]/20 flex items-center gap-2 text-xs text-left w-full transition-colors font-medium border-t border-[#e2e6ec]/60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Student Portal View</span>
                </button>
              )}
              <button
                onClick={() => setProfileMenuOpen(false)}
                className="px-3.5 py-2 text-[#ef4444] hover:bg-[#ffdad6] flex items-center gap-2 text-xs text-left w-full transition-colors border-t border-[#e2e6ec]/60 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Profile Card Button */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#f5f7fa] transition-colors text-left cursor-pointer border border-transparent hover:border-[#e2e6ec]"
            aria-label="Admin Profile Menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#003c84] text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-[#e2e6ec]">
                SK
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#1c1b1b] leading-tight truncate">
                  Prof. S. Kulkarni
                </span>
                <span className="text-[10px] text-[#5c6470] truncate">Admin / TPO</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737782] text-[18px] shrink-0">
              {profileMenuOpen ? 'expand_less' : 'more_vert'}
            </span>
          </button>

          {/* Portal Status Indicator */}
          <div className="px-2.5 py-1.5 rounded bg-[#f6f3f2] flex items-center justify-between">
            <span className="text-[10px] text-[#5c6470]">AY 2024-25 • Central Hub</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[10px] font-semibold text-[#00696c] uppercase">Live</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
