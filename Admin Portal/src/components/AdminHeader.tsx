import React, { useState } from 'react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  searchTerm,
  onSearchChange,
}) => {
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Action required on TCS Placement Drive batch validation',
      time: '15m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Exam Cell uploaded revised winter timetable',
      time: '2h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Circular published: Infosys Mock Interviews Drive',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/95 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e6ec]/70">
      {/* Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#5c6470] hover:text-[#00275a] hover:bg-[#f5f7fa] rounded transition-colors shrink-0 cursor-pointer"
          aria-label="Open sidebar"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="relative flex-1 min-w-0">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3 text-[#737782] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notices by title, reference number, or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-[#f5f7fa] text-sm text-[#1c1b1b] placeholder:text-[#737782] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#003c84] border border-transparent focus:border-[#003c84] transition-all rounded"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-[#737782] hover:text-[#1c1b1b] cursor-pointer"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Notifications */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-3">
        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            className="relative p-2 text-[#434751] hover:bg-[#eae7e7]/70 hover:text-[#1c1b1b] transition-colors rounded cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-white"></span>
          </button>

          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg py-2 z-50 border border-[#e2e6ec] animate-in fade-in">
              <div className="px-4 py-2 border-b border-[#e2e6ec] flex items-center justify-between">
                <span className="font-semibold text-xs text-[#00275a] uppercase tracking-wider">
                  Admin Notifications
                </span>
                <span className="text-[11px] bg-[#d8e2ff] text-[#001a41] px-1.5 py-0.5 rounded font-bold">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-[#e2e6ec] max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-[#f5f7fa] cursor-pointer transition-colors ${
                      n.unread ? 'bg-[#003c84]/5 font-medium' : ''
                    }`}
                  >
                    <p className="text-[#1c1b1b] leading-snug">{n.title}</p>
                    <p className="text-[10px] text-[#5c6470] mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
