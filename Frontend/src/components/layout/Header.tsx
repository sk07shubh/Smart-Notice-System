import React, { useState } from 'react';
import { Search, Bell, Menu, X, ArrowRight, UserCircle, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onNavigateNotice?: (id: string) => void;
  user?: { id: string; name: string; role: string } | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  // New notice button click handler
  onNewNoticeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onNavigateNotice,
  user,
  onLoginClick,
  onLogoutClick,
  onNewNoticeClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'TCS Placement Drive deadline in 24 hours',
      time: '2 hours ago',
      noticeId: 'notice-1',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Revised Examination Timetable published',
      time: '5 hours ago',
      noticeId: 'notice-2',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Mandatory Anti-Ragging Affidavit Submission',
      time: '1 day ago',
      noticeId: 'notice-3',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-14 bg-white/95 backdrop-blur-sm z-30 px-3 sm:px-4 flex items-center justify-between border-b border-[#e2e6ec] shadow-xs">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-[#5c6470] hover:text-[#00275a] hover:bg-[#f5f7fa] rounded transition-colors shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 min-w-0">
          <div className="relative flex items-center w-full bg-[#f5f7fa] rounded-sm px-2.5 py-1.5 border border-[#e2e6ec] focus-within:border-[#003c84] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-[#737782] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearchSubmit) {
                  onSearchSubmit();
                }
              }}
              placeholder="Search notices, events, departments..."
              className="bg-transparent border-none outline-none w-full px-2 text-xs sm:text-sm text-[#1c1b1b] placeholder:text-[#5c6470] placeholder:truncate"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[#737782] hover:text-[#1c1b1b] shrink-0"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] text-[#5c6470] bg-white border border-[#e2e6ec] px-1.5 py-0.5 rounded font-mono shadow-2xs ml-1 shrink-0">
              Ctrl+K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications & Institutional Label */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {user && (user.role === 'ADMIN' || user.role === 'FACULTY') && (
          <button
            id="btn-new-notice"
            onClick={onNewNoticeClick}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#003c84] text-white rounded-lg hover:bg-[#00275a] active:scale-95 transition-all shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            New Notice
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#00275a]/5 border border-[#00275a]/10 rounded-sm text-xs font-semibold text-[#00275a]">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>ICEM Notice Portal</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center text-[#737782] hover:text-[#00275a] hover:bg-[#f5f7fa] rounded transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-[19px] h-[19px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white border border-[#e2e6ec] rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#e2e6ec] flex items-center justify-between">
                <span className="font-semibold text-xs text-[#00275a] uppercase tracking-wider">Latest Alerts</span>
                <span className="text-[11px] text-[#00696c] font-medium hover:underline cursor-pointer">Official Circulars</span>
              </div>
              <div className="divide-y divide-[#e2e6ec] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (onNavigateNotice) onNavigateNotice(n.noticeId);
                      setShowNotifications(false);
                    }}
                    className={`p-3 text-xs hover:bg-[#f5f7fa] cursor-pointer transition-colors flex gap-2.5 items-start ${
                      n.unread ? 'bg-[#003c84]/5 font-medium' : ''
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#003c84] mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[#1c1b1b] leading-tight">{n.title}</p>
                      <p className="text-[10px] text-[#5c6470] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#e2e6ec] text-center bg-[#fcf9f8]">
                <button 
                  onClick={() => {
                    if (onNavigateNotice) onNavigateNotice('notice-1');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-[#003c84] font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  View in Notice Feed <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-[#e2e6ec]"></div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-[#1c1b1b]">{user.name}</span>
              <span className="text-[10px] text-[#5c6470]">{user.role}</span>
            </div>
            <button
              onClick={onLogoutClick}
              className="w-9 h-9 flex items-center justify-center text-[#737782] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-[19px] h-[19px]" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#003c84] hover:bg-[#003c84]/10 rounded transition-colors"
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Admin Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
