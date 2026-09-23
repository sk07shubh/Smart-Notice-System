import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SplashScreen } from './components/layout/SplashScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Header, type HeaderNotification } from './components/layout/Header';
import { ActionRequiredBanner } from './components/layout/ActionRequiredBanner';
import { DashboardView } from './views/DashboardView';
import { NoticesView } from './views/NoticesView';
import { NoticeDetailView } from './views/NoticeDetailView';
import { TimetableView, EventsView } from './views/SecondaryViews';
import { api } from './api';
import { mapNotice, type ApiNotice } from './utils/mapNotice';
import { matchesNavCategory } from './types/notice';
import type { Notice, ActionItem, RecentUpdate } from './types/notice';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchNotices = useCallback(async () => {
    setNoticesLoading(true); setNoticesError(null);
    try {
      const result = await api<{ data: ApiNotice[] }>('/notices?limit=100');
      // Database IDs are authoritative. Notices with matching copy can still
      // be separate records with distinct attachments or publication history.
      setNotices((result.data || []).map(mapNotice));
    } catch (err) {
      setNoticesError(err instanceof Error ? err.message : 'Unable to load notices.');
    } finally { setNoticesLoading(false); }
  }, []);

  useEffect(() => { void fetchNotices(); }, [fetchNotices]);

  // Calculate live counts for the 4 sidebar notice categories
  const categoryCounts = useMemo(() => {
    return {
      all: notices.length,
      exam: notices.filter((n) => matchesNavCategory(n.category, 'exam')).length,
      placement: notices.filter((n) => matchesNavCategory(n.category, 'placement')).length,
      general: notices.filter((n) => matchesNavCategory(n.category, 'general')).length,
    };
  }, [notices]);

  const actionItems = useMemo<ActionItem[]>(() => notices.filter(notice => notice.important || notice.urgent).slice(0, 5).map(notice => ({
    id: notice.id, noticeId: notice.id, title: notice.title, dateLabel: notice.date,
    type: notice.urgent ? 'error' : notice.important ? 'warning' : 'info',
  })), [notices]);

  const recentUpdates = useMemo<RecentUpdate[]>(() => notices.slice(0, 5).map(notice => ({
    id: notice.id, noticeId: notice.id, title: notice.title, department: notice.category,
    timeAgo: [notice.date, notice.time].filter(Boolean).join(' · '), isUrgent: Boolean(notice.important || notice.urgent),
  })), [notices]);

  const headerNotifications = useMemo<HeaderNotification[]>(() => notices.slice(0, 3).map(notice => ({
    id: notice.id,
    title: notice.title,
    time: [notice.date, notice.time].filter(Boolean).join(' · '),
    noticeId: notice.id,
    unread: Boolean(notice.important || notice.urgent),
  })), [notices]);

  // Parse URL hash for robust routing & back/forward/refresh support
  const parseRoute = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'dashboard' || rawHash === 'notices/all' || rawHash === 'notices') {
      return { view: 'dashboard', category: 'all', noticeId: undefined };
    }
    if (rawHash.startsWith('notices/')) {
      const cat = rawHash.replace('notices/', '').toLowerCase();
      if (cat === 'exam' || cat === 'placement' || cat === 'general') {
        return { view: 'notices', category: cat, noticeId: undefined };
      }
      return { view: 'dashboard', category: 'all', noticeId: undefined };
    }
    if (rawHash.startsWith('notice/')) {
      const id = rawHash.replace('notice/', '');
      return { view: 'notice-detail', category: 'all', noticeId: id };
    }
    if (rawHash === 'timetable') {
      return { view: 'timetable', category: 'all', noticeId: undefined };
    }
    if (rawHash === 'events') {
      return { view: 'events', category: 'all', noticeId: undefined };
    }
    return { view: 'dashboard', category: 'all', noticeId: undefined };
  }, []);

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRoute();
      setCurrentView(route.view);
      if (route.category) {
        setSelectedCategory(route.category);
      }
      if (route.noticeId) {
        setSelectedNoticeId(route.noticeId);
      }
    };

    // Run on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [parseRoute]);

  // Navigate helper updating hash
  const navigateTo = (path: string) => {
    const cleanPath = path.replace(/^#\/?/, '').replace(/^\//, '');
    const newHash = `#/${cleanPath}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category selection from left sidebar - opens dedicated category page
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    navigateTo(`notices/${cat}`);
  };

  // Navigate to notice details
  const handleSelectNotice = (id: string) => {
    setSelectedNoticeId(id);
    navigateTo(`notice/${id}`);
  };

  // Find active selected notice for detail view
  const activeNotice = notices.find((n) => n.id === selectedNoticeId) || notices[0];

  // Back button handler from notice detail
  const handleBackFromDetail = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo(selectedCategory ? `notices/${selectedCategory}` : 'notices/all');
    }
  };

  // Toggle acknowledge state
  const handleToggleAcknowledge = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, acknowledged: !n.acknowledged } : n))
    );
  };

  // Toggle bookmark state
  const handleToggleBookmark = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, bookmarked: !n.bookmarked } : n))
    );
  };

  // Global Search trigger
  const handleSearchSubmit = () => {
    if (searchTerm.trim() && currentView !== 'notices' && currentView !== 'dashboard') {
      navigateTo('notices/all');
    }
  };

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search notices"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#1c1b1b] flex flex-col selection:bg-[#003c84] selection:text-white overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onNavigate={(view) => {
          if (view === 'dashboard') {
            navigateTo('dashboard');
          } else if (view === 'notices') {
            navigateTo('notices/all');
          } else {
            navigateTo(view);
          }
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categoryCounts={categoryCounts}
        totalNoticesCount={notices.length}
      />

      {/* Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onNavigateNotice={handleSelectNotice}
        notifications={headerNotifications}
      />

      {/* Main Content Area */}
      <main className="relative pt-14 min-h-screen bg-[#f5f7fa] lg:pl-72 flex flex-col flex-1 max-w-full overflow-x-hidden">
        {(noticesLoading || noticesError) && (
          <div role={noticesError ? 'alert' : 'status'} className={`mx-4 mt-4 rounded border p-3 text-sm ${noticesError ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            {noticesError || 'Loading notices…'}
          </div>
        )}
        {/* Top Action Required Strip */}
        {(currentView === 'dashboard' || currentView === 'notices') && (
          <ActionRequiredBanner
            items={actionItems}
            onSelectNotice={handleSelectNotice}
          />
        )}

        {/* Dynamic View Router */}
        <div className="flex-1 w-full max-w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              notices={notices}
              selectedCategory="all"
              onSelectNotice={handleSelectNotice}
              onNavigateView={(view) => {
                if (view === 'notices') {
                  navigateTo('notices/all');
                } else {
                  navigateTo(view);
                }
              }}
              onRefreshData={fetchNotices}
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm('')}
              recentUpdates={recentUpdates}
            />
          )}

          {currentView === 'notices' && (
            <NoticesView
              key={selectedCategory}
              notices={notices}
              selectedCategory={selectedCategory}
              onSelectNotice={handleSelectNotice}
              initialSearch={searchTerm}
            />
          )}

          {currentView === 'notice-detail' && activeNotice && (
            <NoticeDetailView
              notice={activeNotice}
              allNotices={notices}
              onBack={handleBackFromDetail}
              onSelectNotice={handleSelectNotice}
              onToggleAcknowledge={handleToggleAcknowledge}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentView === 'timetable' && (
            <TimetableView
              onNavigateNotice={handleSelectNotice}
              onNavigateView={(view) => {
                if (view === 'dashboard') navigateTo('dashboard');
                else if (view === 'notices') navigateTo('notices/all');
                else navigateTo(view);
              }}
            />
          )}

          {currentView === 'events' && (
            <EventsView
              onNavigateNotice={handleSelectNotice}
              onNavigateView={(view) => {
                if (view === 'dashboard') navigateTo('dashboard');
                else if (view === 'notices') navigateTo('notices/all');
                else navigateTo(view);
              }}
            />
          )}
        </div>
      </main>
      
      {/* Full Viewport Initial Loading Screen Overlay */}
      <SplashScreen />
    </div>
  );
};

export default App;

