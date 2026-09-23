import React, { useState, useEffect, useCallback } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminNoticeWorkbench } from './views/AdminNoticeWorkbench';
import { AdminBannerManager } from './views/AdminBannerManager';
import { LoginScreen, type AdminSession } from './components/LoginScreen';
import { api } from './api';

export const App: React.FC = () => {
  const [session, setSession] = useState<AdminSession | null>(() => {
    try { return JSON.parse(localStorage.getItem('icem-admin-session') || 'null'); } catch { return null; }
  });
  const [sessionChecked, setSessionChecked] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('manage-notices');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const logout = useCallback(() => { localStorage.removeItem('icem-admin-session'); setSession(null); }, []);
  useEffect(() => { window.addEventListener('admin-auth-expired', logout); return () => window.removeEventListener('admin-auth-expired', logout); }, [logout]);
  useEffect(() => {
    if (!session?.token) { setSessionChecked(true); return; }
    setSessionChecked(false);
    void api('/auth/me', {}, session.token).then(() => setSessionChecked(true)).catch(logout);
  }, [session?.token, logout]);
  const login = (next: AdminSession) => { localStorage.setItem('icem-admin-session', JSON.stringify(next)); setSessionChecked(false); setSession(next); };

  // Keep hooks unconditional: authentication may change between renders.
  const parseRoute = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'dashboard' || rawHash === 'admin-dashboard' || rawHash === 'manage-notices' || rawHash === 'admin' || rawHash === 'admin/manage-notices') return 'dashboard';
    return rawHash;
  }, []);
  useEffect(() => {
    const handleHashChange = () => setCurrentTab(parseRoute());
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [parseRoute]);

  if (session?.token && !sessionChecked) return <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center text-sm text-[#5c6470]">Validating session…</div>;
  if (!session?.token || !session.user || !['ADMIN', 'FACULTY'].includes(session.user.role)) return <LoginScreen onLogin={login} />;

  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#1c1b1b] flex flex-col selection:bg-[#003c84] selection:text-white overflow-x-hidden font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onNavigateTab={handleNavigateTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalNoticesCount={undefined}
        user={session.user}
        onLogout={logout}
      />

      {/* Top App Bar Header */}
      <AdminHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Administrative Content Area */}
      <main className="relative pt-16 min-h-screen bg-[#f5f7fa] lg:ml-64 flex flex-col flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        {currentTab === 'dashboard' || currentTab === 'manage-notices' || currentTab === 'create-notice' ? (
          <AdminNoticeWorkbench
            token={session.token}
            initialSearch={searchTerm}
            currentTab={currentTab}
            onNavigateTab={handleNavigateTab}
          />
        ) : currentTab === 'manage-banner' || currentTab === 'dashboard-banner' || currentTab === 'banner' ? (
          <AdminBannerManager
            token={session.token}
            onNavigateTab={handleNavigateTab}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg border border-[#e2e6ec] p-6 shadow-2xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#003c84]/10 text-[#003c84] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">info</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1c1b1b] capitalize">
                    {currentTab.replace(/-/g, ' ')}
                  </h2>
                  <p className="text-xs text-[#5c6470]">
                    Institutional Administration Workspace
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#5c6470] mb-4">
                This administrative section is connected to the ICEM Central notice distribution hub. You can manage circulars from the main workbench.
              </p>
              <button
                onClick={() => handleNavigateTab('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#003c84] text-white text-xs font-semibold rounded hover:bg-[#00275a] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
