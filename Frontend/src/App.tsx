import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SplashScreen } from './components/layout/SplashScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ActionRequiredBanner } from './components/layout/ActionRequiredBanner';
import { DashboardView } from './views/DashboardView';
import { NoticesView } from './views/NoticesView';
import { NoticeDetailView } from './views/NoticeDetailView';
import { TimetableView, EventsView } from './views/SecondaryViews';
import { LoginModal } from './components/modals/LoginModal';
import { CreateNoticeModal } from './components/modals/CreateNoticeModal';
import { mockActionItems } from './data/mockNotices';
import { mapNotice } from './utils/mapNotice';
import { matchesNavCategory } from './types/notice';
import type { Notice } from './types/notice';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>('notice-1');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateNoticeModalOpen, setIsCreateNoticeModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null
  );

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const openCreateNoticeModal = () => setIsCreateNoticeModalOpen(true);

  // Fetch all notices from the real backend and update state
  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notices?limit=100`
      );
      if (!res.ok) return;
      const body = await res.json();
      if (body.data && Array.isArray(body.data)) {
        setNotices(body.data.map(mapNotice));
      }
    } catch (err) {
      console.error('[fetchNotices]', err);
    }
  }, []);

  // Load notices on mount
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // Called when a notice is successfully created — re-fetch the full list
  const handleCreateNoticeSuccess = async () => {
    await fetchNotices();
  };


  // Calculate live counts for the 4 sidebar notice categories
  const categoryCounts = useMemo(() => {
    return {
      all: notices.length,
      exam: notices.filter((n) => matchesNavCategory(n.category, 'exam')).length,
      placement: notices.filter((n) => matchesNavCategory(n.category, 'placement')).length,
      general: notices.filter((n) => matchesNavCategory(n.category, 'general')).length,
    };
  }, [notices]);

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
      {/* Initial Loading / Splash Screen */}
      <SplashScreen />

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
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        onNewNoticeClick={openCreateNoticeModal}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CreateNoticeModal
        isOpen={isCreateNoticeModalOpen}
        onClose={() => setIsCreateNoticeModalOpen(false)}
        token={token}
        onSuccess={handleCreateNoticeSuccess}
      />

      {/* Main Content Area */}
      <main className="relative pt-14 min-h-screen bg-[#f5f7fa] lg:pl-72 flex flex-col flex-1 max-w-full overflow-x-hidden">
        {/* Top Action Required Strip */}
        {(currentView === 'dashboard' || currentView === 'notices') && (
          <ActionRequiredBanner
            items={mockActionItems}
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
    </div>
  );
};

export default App;
