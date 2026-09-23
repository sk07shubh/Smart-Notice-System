import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { AdminNotice, AdminFilterState, NoticeStatus } from '../types/adminNotice';
import { api } from '../api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const normalizeNoticeDateToKey = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDateForDisplay = (dateKey: string): string => {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

interface AdminNoticeWorkbenchProps {
  token: string;
  initialSearch?: string;
  currentTab?: string;
  onNavigateTab?: (tab: string) => void;
  defaultCreateOpen?: boolean;
}

const initialCreateNoticeState: Partial<AdminNotice> = {
  title: '',
  category: 'Placement',
  status: 'Published',
  department: 'Training & Placement (TPO)',
  departmentKey: 'tpo',
  summary: '',
  issuedBy: 'Prof. S. Kulkarni (Admin / TPO)',
  targetAudience: 'All Final Year Students',
  academicYear: 'AY 2024-25',
  isImportant: false,
  isUrgent: false,
  actionRequired: false,
  actionDeadline: '',
  actionDescription: '',
  attachments: [],
};

export const AdminNoticeWorkbench: React.FC<AdminNoticeWorkbenchProps> = ({
  token,
  initialSearch = '',
  currentTab = 'dashboard',
  onNavigateTab,
}) => {
  const [notices, setNotices] = useState<AdminNotice[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryId, setCategoryId] = useState('');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>('');
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dedicated Create Notice Form state
  const [createNoticeData, setCreateNoticeData] = useState<Partial<AdminNotice>>(initialCreateNoticeState);

  // Filter state
  const [filters, setFilters] = useState<AdminFilterState>({
    search: initialSearch,
    category: 'all',
    department: 'all',
    statusTab: 'all',
    dateFilter: undefined,
    selectedDate: undefined,
  });

  // Date Picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [calYear, setCalYear] = useState<number>(2023);
  const [calMonth, setCalMonth] = useState<number>(9); // 0-indexed: 9 = October

  const toAdminNotice = (notice: any): AdminNotice => ({
    id: notice.id, refNo: notice.id.slice(0, 8).toUpperCase(), title: notice.title,
    category: notice.category?.name || 'General', status: 'Published', summary: notice.description,
    issuedBy: notice.postedBy?.name || 'Administration', department: notice.category?.name || 'Administration', departmentKey: 'admin',
    date: new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date(notice.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    isImportant: notice.isPinned, targetAudience: 'All students', attachments: (notice.attachments || []).map((a: any) => ({ id: a.id, name: a.fileName || a.name || 'Attachment', size: a.fileSize ? `${Math.round(a.fileSize / 1024)} KB` : '', type: 'pdf', url: a.url }))
  });
  const loadData = async () => {
    setLoading(true); setRequestError(null);
    try {
      const [noticeResult, categoryResult] = await Promise.all([
        api<{ data: any[] }>('/notices?limit=100', {}, token), api<{ data: Array<{ id: string; name: string }> }>('/categories', {}, token)
      ]);
      const nextCategories = categoryResult.data || [];
      setCategories(nextCategories); setNotices((noticeResult.data || []).map(toAdminNotice));
      setCategoryId(previous => previous || nextCategories[0]?.id || '');
    } catch (err) { setRequestError(err instanceof Error ? err.message : 'Unable to load notices.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadData(); }, [token]);

  // Sync calendar view month/year when selectedDate changes
  useEffect(() => {
    if (filters.selectedDate) {
      const [y, m] = filters.selectedDate.split('-').map(Number);
      if (y && m) {
        setCalYear(y);
        setCalMonth(m - 1);
      }
    }
  }, [filters.selectedDate]);

  // Click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  // Calendar calculations
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((prev) => prev - 1);
    } else {
      setCalMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((prev) => prev + 1);
    } else {
      setCalMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const selectedKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFilters((prev) => ({ ...prev, selectedDate: selectedKey }));
    setCurrentPage(1);
    setIsDatePickerOpen(false);
  };

  const handleClearDate = () => {
    setFilters((prev) => ({ ...prev, selectedDate: undefined }));
    setCurrentPage(1);
    setIsDatePickerOpen(false);
  };

  // Dates in current month that have notices
  const activeDatesInMonth = useMemo(() => {
    const datesSet = new Set<number>();
    notices.forEach((n) => {
      const key = normalizeNoticeDateToKey(n.date);
      if (key) {
        const [y, m, d] = key.split('-').map(Number);
        if (y === calYear && m - 1 === calMonth) {
          datesSet.add(d);
        }
      }
    });
    return datesSet;
  }, [notices, calYear, calMonth]);

  // Edit state for existing notice
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered notices calculation
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // Search filter
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchTitle = notice.title.toLowerCase().includes(q);
        const matchRef = notice.refNo.toLowerCase().includes(q);
        const matchSummary = notice.summary.toLowerCase().includes(q);
        const matchDept = notice.department.toLowerCase().includes(q);
        const matchIssuer = notice.issuedBy.toLowerCase().includes(q);
        if (!matchTitle && !matchRef && !matchSummary && !matchDept && !matchIssuer) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all') {
        const catFilter = filters.category.toLowerCase();
        const noticeCat = notice.category.toLowerCase();
        if (catFilter === 'general' || catFilter === 'general notices') {
          if (noticeCat !== 'general') {
            return false;
          }
        } else if (noticeCat !== catFilter) {
          return false;
        }
      }

      // Specific Date Filter (Calendar-day match)
      if (filters.selectedDate) {
        const noticeDateKey = normalizeNoticeDateToKey(notice.date);
        if (noticeDateKey !== filters.selectedDate) {
          return false;
        }
      }

      // Department filter (if set)
      if (filters.department && filters.department !== 'all') {
        if (notice.departmentKey !== filters.department) {
          return false;
        }
      }

      // Status tab filter
      if (filters.statusTab === 'published' && notice.status !== 'Published') {
        return false;
      }
      if (filters.statusTab === 'draft' && notice.status !== 'Draft') {
        return false;
      }
      if (filters.statusTab === 'action_required' && !notice.actionRequired) {
        return false;
      }

      return true;
    });
  }, [notices, filters]);

  // Selected notice object
  const activeNotice = useMemo(() => {
    return notices.find((n) => n.id === selectedNoticeId) || filteredNotices[0] || notices[0];
  }, [notices, selectedNoticeId, filteredNotices]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / itemsPerPage));
  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(start, start + itemsPerPage);
  }, [filteredNotices, currentPage, itemsPerPage]);

  // Bulk selection helpers
  const isAllPaginatedSelected =
    paginatedNotices.length > 0 &&
    paginatedNotices.every((n) => selectedNoticeIds.includes(n.id));

  const toggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      const pageIds = new Set(paginatedNotices.map((n) => n.id));
      setSelectedNoticeIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedNotices.map((n) => n.id);
      setSelectedNoticeIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNoticeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      department: 'all',
      statusTab: 'all',
      dateFilter: undefined,
      selectedDate: undefined,
    });
    setCurrentPage(1);
    setIsDatePickerOpen(false);
    showToast('All filters have been reset.');
  };


  // Action: Delete Notice
  const handleDeleteNotice = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this notice?')) {
      try { await api(`/notices/${id}`, { method: 'DELETE' }, token); setNotices((prev) => prev.filter((n) => n.id !== id)); setSelectedNoticeIds((prev) => prev.filter((item) => item !== id)); showToast('Notice deleted successfully.'); }
      catch (err) { setRequestError(err instanceof Error ? err.message : 'Unable to delete notice.'); }
    }
  };

  // Action: Archive Notice
  const handleArchiveNotice = (_id: string) => {
    showToast('Archiving is not supported by the backend notice API.');
  };


  // Action: Open Edit Notice in full page form
  const handleOpenEdit = (notice: AdminNotice) => {
    setEditingNoticeId(notice.id);
    const matchingCategory = categories.find(category => category.name === notice.category);
    setCategoryId(matchingCategory?.id || '');
    setCreateNoticeData({
      id: notice.id,
      refNo: notice.refNo,
      title: notice.title,
      category: notice.category,
      status: notice.status,
      summary: notice.summary,
      issuedBy: notice.issuedBy,
      department: notice.department,
      departmentKey: notice.departmentKey,
      date: notice.date,
      time: notice.time,
      targetAudience: notice.targetAudience,
      academicYear: notice.academicYear,
      isImportant: notice.isImportant || false,
      isUrgent: notice.isUrgent || false,
      actionRequired: notice.actionRequired || false,
      actionDeadline: notice.actionDeadline || '',
      actionDescription: notice.actionDescription || '',
      attachments: notice.attachments ? [...notice.attachments] : [],
    });
    if (onNavigateTab) {
      onNavigateTab('create-notice');
    } else {
      window.location.hash = '#/create-notice';
    }
  };

  // Dedicated Full-Page Create/Edit Notice Save Handler
  const handleSaveCreate = async (e: React.FormEvent, _customStatus?: NoticeStatus) => {
    e.preventDefault();
    if (!createNoticeData.title || !createNoticeData.title.trim()) {
      showToast('Please enter a notice title.');
      return;
    }
    if (!createNoticeData.summary?.trim() || !categoryId) { showToast('A category and description are required.'); return; }
    setIsSaving(true); setRequestError(null);
    try {
      const payload = { title: createNoticeData.title.trim(), description: createNoticeData.summary.trim(), categoryId, isPinned: Boolean(createNoticeData.isImportant), attachmentIds: (createNoticeData.attachments || []).map(a => a.id).filter(Boolean) };
      const isNewNotice = !editingNoticeId;
      const result = await api<{ data: any }>(editingNoticeId ? `/notices/${editingNoticeId}` : '/notices', { method: editingNoticeId ? 'PUT' : 'POST', body: JSON.stringify(payload) }, token);
      const saved = toAdminNotice(result.data);
      if (isNewNotice) {
        setFilters({ search: '', category: 'all', department: 'all', statusTab: 'all', dateFilter: undefined, selectedDate: undefined });
        // The create response is authoritative. Put it at the front immediately
        // so an intermittent follow-up list request cannot hide a successful save.
        setNotices(previous => [saved, ...previous.filter(notice => notice.id !== saved.id)]);
      } else {
        // Edits retain the API's canonical pinned/newest-first list ordering.
        await loadData();
      }
      setCurrentPage(1);
      setSelectedNoticeId(saved.id);
      setEditingNoticeId(null); setCreateNoticeData(initialCreateNoticeState); showToast(isNewNotice ? 'Notice created successfully.' : 'Notice updated successfully.');
    } catch (err) { setRequestError(err instanceof Error ? err.message : 'Unable to save notice.'); return; }
    finally { setIsSaving(false); }

    if (onNavigateTab) {
      onNavigateTab('dashboard');
    } else {
      window.location.hash = '#/dashboard';
    }
  };

  const handleCancelCreate = () => {
    setEditingNoticeId(null);
    setCreateNoticeData(initialCreateNoticeState);
    if (onNavigateTab) {
      onNavigateTab('dashboard');
    } else {
      window.location.hash = '#/dashboard';
    }
  };



  const processUploadedFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const newAttachments: Array<{ id?: string; name: string; size: string; type: 'pdf' | 'excel' | 'doc' | 'image' }> = [];

    for (const file of Array.from(files)) {
      let fileType: 'pdf' | 'excel' | 'doc' | 'image' = 'pdf';
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith('.xls') || nameLower.endsWith('.xlsx') || nameLower.endsWith('.csv')) {
        fileType = 'excel';
      } else if (nameLower.endsWith('.doc') || nameLower.endsWith('.docx')) {
        fileType = 'doc';
      } else if (
        nameLower.endsWith('.jpg') ||
        nameLower.endsWith('.jpeg') ||
        nameLower.endsWith('.png') ||
        nameLower.endsWith('.webp')
      ) {
        fileType = 'image';
      }

      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      try { const upload = await api<{ data: { id: string } }>('/upload', { method: 'POST', body: (() => { const form = new FormData(); form.append('file', file); return form; })() }, token); newAttachments.push({ id: upload.data.id, name: file.name, size: sizeStr, type: fileType }); }
      catch (err) { setRequestError(err instanceof Error ? err.message : `Unable to upload ${file.name}.`); }
    }

    setCreateNoticeData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments],
    }));

    if (newAttachments.length) showToast(`Uploaded ${newAttachments.length} document${newAttachments.length > 1 ? 's' : ''}`);
  };

  const handleFileAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processUploadedFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleFileAttachmentDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setCreateNoticeData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }));
  };

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = notices.length;
    const published = notices.filter((n) => n.status === 'Published').length;
    const draft = notices.filter((n) => n.status === 'Draft').length;
    const actionRequired = notices.filter((n) => n.actionRequired).length;
    return {
      total,
      published,
      draft,
      actionRequired,
    };
  }, [notices]);

  return (
    <div className="w-full flex flex-col gap-5">
      {(loading || requestError || isSaving) && <div role={requestError ? 'alert' : 'status'} className={`rounded-lg border p-3 text-sm ${requestError ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>{requestError || (isSaving ? 'Saving notice…' : 'Loading live notices…')}</div>}
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00275a] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-[#d8e2ff]/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white ml-2 cursor-pointer"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {currentTab === 'create-notice' ? (
        /* ========================================================================= */
        /* DEDICATED FULL-PAGE CREATE NOTICE VIEW                                   */
        /* ========================================================================= */
        <div className="w-full flex flex-col gap-6">
          {/* Page Title & Breadcrumbs */}
          <div className="flex items-start sm:items-center gap-3.5 pt-2 sm:pt-3 border-b border-[#e2e6ec] pb-5">
            <button
              type="button"
              onClick={handleCancelCreate}
              className="p-2.5 bg-white text-[#5c6470] hover:text-[#00275a] hover:bg-[#f0f4fd] border border-[#e2e6ec] hover:border-[#00275a]/40 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0"
              title="Return to Notice Dashboard"
              aria-label="Return to Notice Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#5c6470] tracking-wide">Notice Management</span>
                <span className="text-xs text-[#737782]">/</span>
                <span className="text-xs font-semibold text-[#00275a]">
                  {editingNoticeId ? 'Edit Notice' : 'Create Notice'}
                </span>
                <span className="text-[10px] font-bold uppercase bg-[#d8e2ff] text-[#001a41] px-1.5 py-0.5 rounded">
                  {editingNoticeId ? `Editing: ${createNoticeData.refNo || 'Notice'}` : 'Institutional Circular'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#00275a] tracking-tight leading-tight mt-0.5">
                {editingNoticeId ? 'Edit Notice' : 'Create Notice'}
              </h1>
              <p className="text-sm text-[#5c6470] leading-relaxed">
                {editingNoticeId
                  ? 'Update notice details, target audience, action requirements, and circular attachments.'
                  : 'Compose, target, and publish institutional announcements for students and faculty members.'}
              </p>
            </div>
          </div>

          {/* Form Layout Grid */}
          <form onSubmit={(e) => handleSaveCreate(e, (createNoticeData.status as NoticeStatus) || 'Published')} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Primary Notice Form Cards */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Card 1: Core Notice Information */}
              <div className="bg-white rounded-xl border border-[#e2e6ec] p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e6ec]">
                  <div className="w-8 h-8 rounded-lg bg-[#003c84]/10 text-[#003c84] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#00275a]">Notice Content &amp; Details</h2>
                    <p className="text-xs text-[#5c6470]">Specify the primary notice headline, category, and circular body.</p>
                  </div>
                </div>

                {/* Title Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#434751] flex items-center justify-between">
                    <span>Notice Title <span className="text-[#ef4444]">*</span></span>
                    <span className="text-[11px] font-normal text-[#737782] lowercase">required</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCS Campus Recruitment Drive 2024 - Important Updates"
                    value={createNoticeData.title || ''}
                    onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm placeholder:text-[#737782] border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none transition-colors"
                  />
                </div>

                {/* Category & Department Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                      Category <span className="text-[#ef4444]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={categoryId}
                        onChange={(e) => { const category = categories.find(item => item.id === e.target.value); setCategoryId(e.target.value); setCreateNoticeData(prev => ({ ...prev, category: (category?.name || '') as any })); }}
                        className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none appearance-none cursor-pointer pr-8"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737782] text-[18px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                      Issuing Department
                    </label>
                    <div className="relative">
                      <select
                        value={createNoticeData.departmentKey || 'tpo'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const deptName =
                            val === 'tpo'
                              ? 'Training & Placement (TPO)'
                              : val === 'exam'
                                ? 'Exam Cell'
                                : val === 'comp'
                                  ? 'Computer Engg'
                                  : val === 'it'
                                    ? 'IT Department'
                                    : 'Administration';
                          setCreateNoticeData((prev) => ({
                            ...prev,
                            departmentKey: val as any,
                            department: deptName,
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none appearance-none cursor-pointer pr-8"
                      >
                        <option value="tpo">Training &amp; Placement (TPO)</option>
                        <option value="exam">Exam Cell</option>
                        <option value="comp">Computer Engg</option>
                        <option value="it">IT Department</option>
                        <option value="admin">Administration</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737782] text-[18px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary / Body */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#434751] flex items-center justify-between">
                    <span>Notice Description &amp; Instructions <span className="text-[#ef4444]">*</span></span>
                    <span className="text-[11px] font-normal text-[#737782] lowercase">required</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter the complete circular text, batch eligibility, schedules, room allocations, rules, and student instructions..."
                    value={createNoticeData.summary || ''}
                    onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, summary: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm placeholder:text-[#737782] border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>

              {/* Card 2: Audience & Issuance Metadata */}
              <div className="bg-white rounded-xl border border-[#e2e6ec] p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e6ec]">
                  <div className="w-8 h-8 rounded-lg bg-[#00696c]/10 text-[#00696c] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#00275a]">Audience &amp; Issuing Metadata</h2>
                    <p className="text-xs text-[#5c6470]">Configure recipient targeting and issuing authority.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                      Issued By (Authority)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. S. Kulkarni (Admin / TPO)"
                      value={createNoticeData.issuedBy || ''}
                      onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, issuedBy: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. All Final Year Students / FE, SE, TE, BE"
                      value={createNoticeData.targetAudience || ''}
                      onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Attachments */}
              <div className="bg-white rounded-xl border border-[#e2e6ec] p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e6ec]">
                  <div className="w-8 h-8 rounded-lg bg-[#003c84]/10 text-[#003c84] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#00275a]">Supporting Attachments</h2>
                    <p className="text-xs text-[#5c6470]">Attach PDFs, spreadsheets, or forms relevant to this circular.</p>
                  </div>
                </div>

                {/* Hidden File Input for Device Upload */}
                <input
                  type="file"
                  multiple
                  ref={attachmentFileInputRef}
                  onChange={handleFileAttachmentUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                  className="hidden"
                />

                {/* Drag and Drop Document Upload Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                  }}
                  onDrop={handleFileAttachmentDrop}
                  onClick={() => attachmentFileInputRef.current?.click()}
                  className={`p-5 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                    isDraggingFile
                      ? 'border-[#003c84] bg-[#f0f4fd] ring-2 ring-[#003c84]/20'
                      : 'border-[#d0d7de] hover:border-[#003c84] bg-[#fcfdfe] hover:bg-[#f8faff]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isDraggingFile ? 'bg-[#003c84] text-white' : 'bg-[#f0f4fd] text-[#003c84] border border-[#d8e2ff]'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <p className="text-xs sm:text-sm font-bold text-[#00275a]">
                      Drag &amp; drop documents here
                    </p>
                    <p className="text-xs text-[#5c6470]">
                      or <span className="text-[#003c84] font-semibold underline underline-offset-2">click to browse</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-[#737782] tracking-wide">
                    Supported: PDF, DOCX, XLSX, CSV, JPG, PNG (Max 10MB)
                  </p>
                </div>

                {/* Attached files list */}
                {createNoticeData.attachments && createNoticeData.attachments.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-[#e2e6ec]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                      Selected Attachments ({createNoticeData.attachments.length})
                    </span>
                    {createNoticeData.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e2e6ec]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="material-symbols-outlined text-[#00275a] text-[20px] shrink-0">
                            {att.type === 'pdf' ? 'picture_as_pdf' : att.type === 'excel' ? 'table_chart' : 'description'}
                          </span>
                          <span className="text-xs font-semibold text-[#1c1b1b] truncate">{att.name}</span>
                          <span className="text-[11px] text-[#5c6470] shrink-0">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="p-1 text-[#737782] hover:text-[#ef4444] rounded cursor-pointer shrink-0"
                          title="Remove file"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (4 cols): Settings, Preview & Actions */}
            <div className="lg:col-span-4 flex flex-col gap-5 sticky top-20">
              {/* Publishing Options Card */}
              <div className="bg-white rounded-xl border border-[#e2e6ec] p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#e2e6ec]">
                  <span className="material-symbols-outlined text-[#00275a] text-[20px]">tune</span>
                  <h3 className="font-bold text-sm text-[#00275a]">Publishing Controls</h3>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#434751]">Notice Status</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateNoticeData((prev) => ({ ...prev, status: 'Published' }))}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${createNoticeData.status === 'Published'
                          ? 'bg-[#ecfdf5] border-[#10b981] text-[#059669] ring-1 ring-[#10b981]'
                          : 'bg-white border-[#e2e6ec] text-[#5c6470] hover:bg-[#f6f3f2]'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                      <span>Published</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateNoticeData((prev) => ({ ...prev, status: 'Draft' }))}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${createNoticeData.status === 'Draft'
                          ? 'bg-[#fff7ed] border-[#ea580c] text-[#ea580c] ring-1 ring-[#ea580c]'
                          : 'bg-white border-[#e2e6ec] text-[#5c6470] hover:bg-[#f6f3f2]'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
                      <span>Draft</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-[#e2e6ec]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#434751]">Priority Flag</span>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs text-[#1c1b1b] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createNoticeData.isUrgent || false}
                        onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, isUrgent: e.target.checked }))}
                        className="accent-[#ef4444] h-3.5 w-3.5 rounded"
                      />
                      <span className="font-medium">Mark as Urgent (Red Badge)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#1c1b1b] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createNoticeData.isImportant || false}
                        onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, isImportant: e.target.checked }))}
                        className="accent-[#00275a] h-3.5 w-3.5 rounded"
                      />
                      <span className="font-medium">Mark as Important (High Priority)</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-3 border-t border-[#e2e6ec]">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#003c84] hover:bg-[#00275a] text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {editingNoticeId ? 'save' : 'send'}
                    </span>
                    <span>{editingNoticeId ? 'Update Notice' : 'Publish Notice'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSaveCreate(e, 'Draft')}
                    className="w-full py-2 bg-white border border-[#fed7aa] text-[#ea580c] hover:bg-[#fff7ed] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">draft</span>
                    <span>Save as Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className="w-full py-1 text-xs text-[#5c6470] hover:text-[#1c1b1b] underline text-center transition-colors cursor-pointer"
                  >
                    Cancel &amp; Return to Dashboard
                  </button>
                </div>
              </div>

              {/* Student Action & Deadlines Card */}
              <div className="bg-white rounded-xl border border-[#e2e6ec] p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e6ec]">
                  <div className="w-8 h-8 rounded-lg bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">alarm</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#00275a]">Student Action &amp; Deadlines</h2>
                    <p className="text-xs text-[#5c6470]">Flag this notice if students must complete a task or meet a cutoff deadline.</p>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-3.5 bg-[#f6f3f2] hover:bg-[#f0eded] rounded-lg border border-[#e2e6ec] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="fullPageActionRequiredCheck"
                    checked={createNoticeData.actionRequired || false}
                    onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, actionRequired: e.target.checked }))}
                    className="accent-[#00275a] h-4 w-4 mt-0.5 rounded cursor-pointer shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-[#1c1b1b] leading-snug">
                      Action Required / Mandatory Student Submission
                    </span>
                    <span className="text-xs text-[#5c6470] mt-0.5 leading-normal">
                      Shows an alert banner with a submission deadline timer on the student dashboard.
                    </span>
                  </div>
                </label>

                {createNoticeData.actionRequired && (
                  <div className="flex flex-col gap-3.5 pt-1 animate-in fade-in duration-200">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                        Action Deadline
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737782] text-[18px]">
                          event
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Oct 28, 2024 · 05:00 PM"
                          value={createNoticeData.actionDeadline || ''}
                          onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, actionDeadline: e.target.value }))}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#434751]">
                        Action Description / Instruction
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mandatory student submission required for hall ticket validation."
                        value={createNoticeData.actionDescription || ''}
                        onChange={(e) => setCreateNoticeData((prev) => ({ ...prev, actionDescription: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded-lg focus:border-[#003c84] focus:ring-1 focus:ring-[#003c84] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Card */}
              <div className="bg-white rounded-xl border border-[#e2e6ec] p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e6ec]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#00275a] text-[18px]">preview</span>
                    <span className="font-bold text-xs text-[#00275a] uppercase tracking-wider">Live Preview</span>
                  </div>
                  <span className="text-[10px] text-[#5c6470] bg-[#f6f3f2] px-2 py-0.5 rounded font-medium">
                    Student View
                  </span>
                </div>

                <div className="p-3.5 rounded-lg border border-[#e2e6ec] bg-[#f5f7fa] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {createNoticeData.isImportant && (
                      <span className="w-2 h-2 rounded-full bg-[#00275a]" title="Important"></span>
                    )}
                    {createNoticeData.isUrgent && (
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]" title="Urgent"></span>
                    )}
                    <span className="text-[10px] font-bold uppercase bg-[#d8e2ff] text-[#001a41] px-1.5 py-0.5 rounded">
                      {createNoticeData.category || 'Placement'}
                    </span>
                    <span className="text-[10px] bg-white border border-[#e2e6ec] text-[#5c6470] px-1.5 py-0.5 rounded">
                      {createNoticeData.department || 'Training & Placement (TPO)'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#00275a] leading-snug line-clamp-2">
                    {createNoticeData.title || 'Untitled Notice Headline'}
                  </h4>

                  <p className="text-xs text-[#434751] line-clamp-3 leading-relaxed">
                    {createNoticeData.summary || 'Notice summary text and instructions will appear here as you type.'}
                  </p>

                  {createNoticeData.actionRequired && (
                    <div className="p-2 bg-[#fff7ed] border border-[#fed7aa] rounded flex items-center gap-1.5 text-[11px] text-[#ea580c] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">alarm</span>
                      <span>Deadline: {createNoticeData.actionDeadline || 'Date not specified'}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#e2e6ec] flex items-center justify-between text-[10px] text-[#5c6470]">
                    <span>{createNoticeData.issuedBy || 'Prof. S. Kulkarni'}</span>
                    <span>Today · Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ========================================================================= */
        /* MAIN NOTICE DASHBOARD WORKBENCH VIEW                                     */
        /* ========================================================================= */
        <>
          {/* Page Header & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 sm:pt-3">
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#00275a] tracking-tight leading-tight">
                Manage Notices
              </h1>
              <p className="text-sm text-[#5c6470] max-w-xl leading-relaxed mt-0.5">
                Create, publish, and manage institutional notices across academic and administrative branches.
              </p>
            </div>
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                onClick={() => {
                  setEditingNoticeId(null);
                  setCreateNoticeData(initialCreateNoticeState);
                  if (onNavigateTab) {
                    onNavigateTab('create-notice');
                  } else {
                    window.location.hash = '#/create-notice';
                  }
                }}
                className="px-3.5 py-2 bg-[#003c84] text-white text-xs sm:text-sm font-semibold hover:bg-[#00275a] transition-colors flex items-center gap-1.5 shadow-2xs rounded cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Create Notice</span>
              </button>
            </div>
          </div>

          {/* Redesigned 3-Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full items-stretch">
            {/* Total Notices */}
            <div
              onClick={() => {
                setFilters((prev) => ({ ...prev, statusTab: 'all' }));
                setCurrentPage(1);
              }}
              className={`flex flex-col justify-between h-full min-h-[112px] bg-white rounded-xl border p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 group cursor-pointer select-none ${filters.statusTab === 'all'
                  ? 'border-[#00275a] ring-1 ring-inset ring-[#00275a]'
                  : 'border-[#e2e6ec] hover:border-[#cbd5e1]'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5c6470] truncate">
                  Total Notices
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#d8e2ff] text-[#00275a] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">feed</span>
                </div>
              </div>
              <div className="mt-auto pt-3 flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold text-[#00275a] tracking-tight leading-none">
                  {stats.total}
                </span>
                <span className="text-[11px] font-medium text-[#5c6470] bg-[#f5f7fa] px-2 py-0.5 rounded border border-[#e2e6ec]/60 shrink-0">
                  Repository
                </span>
              </div>
            </div>

            {/* Published Notices */}
            <div
              onClick={() => {
                setFilters((prev) => ({ ...prev, statusTab: prev.statusTab === 'published' ? 'all' : 'published' }));
                setCurrentPage(1);
              }}
              className={`flex flex-col justify-between h-full min-h-[112px] bg-white rounded-xl border p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 group cursor-pointer select-none ${filters.statusTab === 'published'
                  ? 'border-[#059669] ring-1 ring-inset ring-[#059669]'
                  : 'border-[#e2e6ec] hover:border-[#cbd5e1]'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5c6470] truncate">
                  Published Notices
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#d1fae5] text-[#059669] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
              </div>
              <div className="mt-auto pt-3 flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold text-[#059669] tracking-tight leading-none">
                  {stats.published}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  Live Portal
                </span>
              </div>
            </div>

            {/* Saved / Draft Notices */}
            <div
              onClick={() => {
                setFilters((prev) => ({ ...prev, statusTab: prev.statusTab === 'draft' ? 'all' : 'draft' }));
                setCurrentPage(1);
              }}
              className={`flex flex-col justify-between h-full min-h-[112px] bg-white rounded-xl border p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 group cursor-pointer select-none ${filters.statusTab === 'draft'
                  ? 'border-[#ea580c] ring-1 ring-inset ring-[#ea580c]'
                  : 'border-[#e2e6ec] hover:border-[#cbd5e1]'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5c6470] truncate">
                  Saved / Draft
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">draft</span>
                </div>
              </div>
              <div className="mt-auto pt-3 flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold text-[#ea580c] tracking-tight leading-none">
                  {stats.draft}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#c2410c] bg-[#fff7ed] px-2 py-0.5 rounded border border-[#fed7aa]/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
                  Drafts
                </span>
              </div>
            </div>
          </div>

          {/* Split Master-Detail Workbench Layout (~62% Left, ~38% Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (lg:col-span-7 xl:col-span-7): Filter Bar + Notice Master List */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-3">
              {/* Filter & Query Command Bar */}
              <div className="bg-white p-3.5 rounded-lg border border-[#e2e6ec] shadow-xs flex flex-col gap-3">
                {/* Top Filter Row: Search & Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  {/* Search Input */}
                  <div className="sm:col-span-6 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737782] text-[18px]">
                      search
                    </span>
                    <input
                      value={filters.search}
                      onChange={(e) => {
                        setFilters((prev) => ({ ...prev, search: e.target.value }));
                        setCurrentPage(1);
                      }}
                      placeholder="Search by title, ref no, or keywords..."
                      type="text"
                      className="w-full pl-9 pr-3 py-2 bg-white text-[#1c1b1b] text-sm placeholder:text-[#737782] border border-[#e2e6ec] rounded focus:border-[#00275a] focus:ring-1 focus:ring-[#00275a] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="sm:col-span-3 relative">
                    <select
                      value={filters.category}
                      onChange={(e) => {
                        setFilters((prev) => ({ ...prev, category: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-2 bg-white text-[#1c1b1b] text-sm border border-[#e2e6ec] rounded focus:border-[#00275a] focus:ring-1 focus:ring-[#00275a] focus:outline-none appearance-none cursor-pointer pr-7 text-ellipsis overflow-hidden transition-colors"
                      aria-label="Filter notices by category"
                    >
                      <option value="all">All Categories</option>
                      <option value="exam">Exam</option>
                      <option value="placement">Placement</option>
                      <option value="general">General Notices</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#737782] text-[16px] pointer-events-none">
                      expand_more
                    </span>
                  </div>

                  {/* Date Filter: Select Date */}
                  <div className="sm:col-span-3 relative" ref={datePickerRef}>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen((prev) => !prev)}
                      className={`w-full px-2.5 py-2 bg-white text-sm border rounded focus:border-[#00275a] focus:ring-1 focus:ring-[#00275a] focus:outline-none cursor-pointer transition-colors flex items-center justify-between gap-1 text-left ${filters.selectedDate
                          ? 'border-[#00275a] text-[#00275a] font-semibold bg-[#f0f4fd]'
                          : 'border-[#e2e6ec] text-[#1c1b1b] hover:border-[#cbd5e1]'
                        }`}
                      aria-label="Filter notices by date"
                      aria-expanded={isDatePickerOpen}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <span
                          className={`material-symbols-outlined text-[16px] shrink-0 ${filters.selectedDate ? 'text-[#00275a]' : 'text-[#737782]'
                            }`}
                        >
                          calendar_today
                        </span>
                        <span className="truncate text-sm">
                          {filters.selectedDate ? formatDateForDisplay(filters.selectedDate) : 'Select Date'}
                        </span>
                      </div>

                      {filters.selectedDate ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters((prev) => ({ ...prev, selectedDate: undefined }));
                            setCurrentPage(1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              setFilters((prev) => ({ ...prev, selectedDate: undefined }));
                              setCurrentPage(1);
                            }
                          }}
                          className="p-0.5 hover:bg-[#d8e2ff] text-[#737782] hover:text-[#00275a] rounded transition-colors cursor-pointer shrink-0"
                          title="Clear date filter"
                          aria-label="Clear date filter"
                        >
                          <span className="material-symbols-outlined text-[15px] block">close</span>
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[#737782] text-[16px] shrink-0 pointer-events-none">
                          expand_more
                        </span>
                      )}
                    </button>

                    {/* Compact Calendar Popup Dropdown */}
                    {isDatePickerOpen && (
                      <div className="absolute right-0 sm:right-auto sm:left-0 top-full mt-1.5 z-50 bg-white border border-[#e2e6ec] rounded-lg shadow-lg p-3 w-[270px] text-[#1c1b1b]">
                        {/* Month & Year Header with Nav */}
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#e2e6ec]">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 text-[#737782] hover:text-[#00275a] hover:bg-[#f0eded] rounded transition-colors cursor-pointer"
                            title="Previous Month"
                            aria-label="Previous month"
                          >
                            <span className="material-symbols-outlined text-[18px] block">chevron_left</span>
                          </button>

                          <span className="text-xs font-bold text-[#00275a] tracking-tight">
                            {MONTH_NAMES[calMonth]} {calYear}
                          </span>

                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 text-[#737782] hover:text-[#00275a] hover:bg-[#f0eded] rounded transition-colors cursor-pointer"
                            title="Next Month"
                            aria-label="Next month"
                          >
                            <span className="material-symbols-outlined text-[18px] block">chevron_right</span>
                          </button>
                        </div>

                        {/* Weekday Labels Header */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                            <span key={d} className="text-[10px] font-semibold text-[#5c6470] uppercase">
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Day Cells Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {/* Empty cells before month starts */}
                          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-7 h-7" />
                          ))}

                          {/* Days of current month */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = filters.selectedDate === dayKey;
                            const hasNotices = activeDatesInMonth.has(day);

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleSelectDay(day)}
                                className={`w-7 h-7 text-xs rounded flex flex-col items-center justify-center transition-colors relative cursor-pointer ${isSelected
                                    ? 'bg-[#00275a] text-white font-bold shadow-xs'
                                    : 'hover:bg-[#f0f4fd] hover:text-[#00275a] text-[#1c1b1b]'
                                  }`}
                              >
                                <span>{day}</span>
                                {hasNotices && !isSelected && (
                                  <span className="w-1 h-1 rounded-full bg-[#00275a] absolute bottom-0.5"></span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Footer with Reset / All Dates */}
                        <div className="mt-2.5 pt-2 border-t border-[#e2e6ec] flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={handleClearDate}
                            className="text-[#00696c] hover:text-[#00275a] font-medium transition-colors cursor-pointer"
                          >
                            All Dates
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCalYear(2023);
                              setCalMonth(9);
                            }}
                            className="text-[#5c6470] hover:text-[#1c1b1b] text-[11px] transition-colors cursor-pointer"
                          >
                            Oct 2023
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Pills / Status Filter Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e2e6ec]/80">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] uppercase tracking-wider text-[#5c6470] mr-1 font-semibold">
                      Status:
                    </span>
                    <button
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, statusTab: 'all' }));
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${filters.statusTab === 'all'
                          ? 'bg-[#00275a] text-white font-semibold shadow-xs'
                          : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#434751] font-medium'
                        }`}
                      type="button"
                    >
                      All ({notices.length})
                    </button>
                    <button
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, statusTab: 'published' }));
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${filters.statusTab === 'published'
                          ? 'bg-[#00275a] text-white font-semibold shadow-xs'
                          : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#434751] font-medium'
                        }`}
                      type="button"
                    >
                      Published ({stats.published})
                    </button>
                    <button
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, statusTab: 'draft' }));
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer flex items-center gap-1 ${filters.statusTab === 'draft'
                          ? 'bg-[#00275a] text-white font-semibold shadow-xs'
                          : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#434751] font-medium'
                        }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">draft</span>
                      <span>Saved / Draft ({stats.draft})</span>
                    </button>

                    {filters.selectedDate && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0f4fd] border border-[#00275a]/30 text-[#00275a] text-xs rounded">
                        <span className="material-symbols-outlined text-[14px] text-[#00275a]">
                          calendar_today
                        </span>
                        <span className="font-semibold">{formatDateForDisplay(filters.selectedDate)}</span>
                        <button
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, selectedDate: undefined }));
                            setCurrentPage(1);
                          }}
                          className="text-[#737782] hover:text-[#00275a] ml-0.5 cursor-pointer"
                          type="button"
                          aria-label="Remove selected date filter"
                        >
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetFilters}
                      className="text-[#00696c] hover:text-[#00275a] text-xs underline transition-colors cursor-pointer font-medium"
                      type="button"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Notice Master List */}
              <div className="bg-white rounded-lg shadow-xs border border-[#e2e6ec] overflow-hidden">
                {/* List Header Bar */}
                <div className="px-4 py-2.5 bg-[#f6f3f2] border-b border-[#e2e6ec] flex items-center justify-between text-[#434751]">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={isAllPaginatedSelected}
                      onChange={toggleSelectAll}
                      className="accent-[#00275a] cursor-pointer h-4 w-4 rounded"
                      type="checkbox"
                      aria-label="Select all notices"
                    />
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      Notice Title &amp; Overview
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#5c6470]">
                      Showing <strong className="text-[#00275a] font-semibold">{paginatedNotices.length}</strong> of{' '}
                      {filteredNotices.length} notices
                    </span>
                    <div className="h-3 w-px bg-[#e2e6ec]"></div>
                    <span className="text-xs uppercase tracking-wider text-[#5c6470]">Status</span>
                  </div>
                </div>

                {/* Notice List Items */}
                <div className="divide-y divide-[#e2e6ec]">
                  {paginatedNotices.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#737782] mb-2">
                        search_off
                      </span>
                      <p className="text-sm font-semibold text-[#1c1b1b]">No matching notices found</p>
                      <p className="text-xs text-[#5c6470] mt-1">
                        Try adjusting your search criteria or reset filters.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 text-xs bg-[#00275a] text-white rounded font-medium cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    paginatedNotices.map((notice) => {
                      const isSelected = activeNotice?.id === notice.id;
                      const isChecked = selectedNoticeIds.includes(notice.id);

                      return (
                        <div
                          key={notice.id}
                          onClick={() => setSelectedNoticeId(notice.id)}
                          className={`p-4 transition-all cursor-pointer relative ${isSelected
                              ? 'bg-[#d8e2ff]/30 border-l-4 border-[#00275a]'
                              : 'hover:bg-[#f6f3f2]/60 border-l-4 border-transparent'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Checkbox & Details */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <input
                                checked={isChecked}
                                onClick={(e) => toggleSelectRow(notice.id, e)}
                                onChange={() => { }}
                                className="accent-[#00275a] cursor-pointer h-4 w-4 mt-1 rounded shrink-0"
                                type="checkbox"
                                aria-label={`Select notice ${notice.title}`}
                              />
                              <div className="flex flex-col gap-1 min-w-0 flex-1">
                                {/* Priority Dot + Title + Ref Badge + Category Tag */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {notice.isImportant && (
                                    <span
                                      className="w-2 h-2 rounded-full bg-[#00275a] shrink-0"
                                      title="Important Notice"
                                    ></span>
                                  )}
                                  {notice.isUrgent && (
                                    <span
                                      className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0"
                                      title="Urgent Notice"
                                    ></span>
                                  )}

                                  <h3
                                    className="text-[15px] sm:text-[16px] font-bold tracking-tight text-[#00275a] hover:underline truncate max-w-md"
                                  >
                                    {notice.title}
                                  </h3>

                                  <span className="text-[11px] bg-[#d8e2ff] text-[#001a41] font-semibold px-1.5 py-0.5 uppercase tracking-wide rounded shrink-0">
                                    {notice.refNo}
                                  </span>

                                  <span
                                    className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded shrink-0 ${notice.category === 'Placement'
                                        ? 'text-[#00696c] bg-[#75f6fb]/50'
                                        : notice.category === 'Exam'
                                          ? 'text-[#00275a] bg-[#d8e2ff]'
                                          : notice.category === 'Event'
                                            ? 'text-[#6f2801] bg-[#ffdbcd]'
                                            : 'text-[#434751] bg-[#f0eded]'
                                      }`}
                                  >
                                    {notice.category}
                                  </span>
                                </div>

                                {/* 2-line snippet */}
                                <p className="text-[13px] text-[#434751] line-clamp-2 leading-relaxed">
                                  {notice.summary}
                                </p>

                                {/* Author & Timestamp Metadata */}
                                <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[#5c6470] text-xs flex-wrap">
                                  <span className="flex items-center gap-1 font-medium text-[#1c1b1b]">
                                    <span className="material-symbols-outlined text-[15px] text-[#737782]">
                                      person
                                    </span>
                                    {notice.issuedBy}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {notice.date} · {notice.time}
                                  </span>
                                  {notice.actionRequired && (
                                    <>
                                      <span>•</span>
                                      <span className="text-[#f59e0b] font-semibold flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-[13px]">alarm</span>
                                        Action Required: {notice.actionDeadline ? notice.actionDeadline.split(',')[0] : 'Yes'}
                                      </span>
                                    </>
                                  )}
                                  {notice.isUrgent && (
                                    <>
                                      <span>•</span>
                                      <span className="text-[#ef4444] font-semibold flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-[13px]">warning</span>
                                        Urgent
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Badge & Quick Actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs uppercase tracking-wider font-semibold rounded ${notice.status === 'Published'
                                    ? 'text-[#10b981] bg-[#ecfdf5] border border-[#a7f3d0]/60'
                                    : notice.status === 'Draft'
                                      ? 'text-[#ea580c] bg-[#fff7ed] border border-[#fed7aa]/60'
                                      : 'text-[#737782] bg-[#f0eded] border border-[#e2e6ec]'
                                  }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${notice.status === 'Published'
                                      ? 'bg-[#10b981]'
                                      : notice.status === 'Draft'
                                        ? 'bg-[#ea580c]'
                                        : 'bg-[#737782]'
                                    }`}
                                ></span>
                                <span>{notice.status}</span>
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNoticeId(notice.id);
                                  }}
                                  className="p-1 text-[#00275a] hover:bg-[#f0eded] rounded transition-colors cursor-pointer"
                                  title="Quick Inspect"
                                  type="button"
                                  aria-label="Inspect notice details"
                                >
                                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEdit(notice);
                                  }}
                                  className="p-1 text-[#737782] hover:text-[#00275a] hover:bg-[#f0eded] rounded transition-colors cursor-pointer"
                                  title="Edit Notice"
                                  type="button"
                                  aria-label="Edit notice"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Pagination & Navigation Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
                <div className="flex items-center gap-4 text-sm text-[#5c6470] flex-wrap">
                  <div>
                    Showing{' '}
                    <span className="font-semibold text-[#1c1b1b]">
                      {filteredNotices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-[#1c1b1b]">
                      {Math.min(currentPage * itemsPerPage, filteredNotices.length)}
                    </span>{' '}
                    of <span className="font-semibold text-[#1c1b1b]">{filteredNotices.length}</span> notices
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5c6470]">Items per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-0.5 bg-white border border-[#e2e6ec] text-[#1c1b1b] text-xs focus:outline-none rounded cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <nav aria-label="Notices pagination" className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-white text-[#737782] border border-[#e2e6ec] text-xs font-medium hover:bg-[#f6f3f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 rounded cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                      const isCurrent = pg === currentPage;
                      return (
                        <button
                          key={pg}
                          onClick={() => setCurrentPage(pg)}
                          className={`w-8 h-8 flex items-center justify-center text-xs rounded transition-colors cursor-pointer ${isCurrent
                              ? 'font-semibold bg-[#00275a] text-white border border-[#00275a]'
                              : 'font-medium bg-white text-[#1c1b1b] border border-[#e2e6ec] hover:bg-[#f6f3f2]'
                            }`}
                          type="button"
                        >
                          {pg}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 bg-white text-[#1c1b1b] border border-[#e2e6ec] text-xs font-medium hover:bg-[#f6f3f2] hover:text-[#00275a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 rounded cursor-pointer"
                    type="button"
                  >
                    <span>Next</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Right Column (~38% width: lg:col-span-5): Sticky Quick Inspect & Actions Inspector Card */}
            <div className="lg:col-span-5 xl:col-span-5 sticky top-20">
              {activeNotice ? (
                <div className="bg-white rounded-lg border border-[#e2e6ec] shadow-xs overflow-hidden flex flex-col">
                  {/* Inspector Header */}
                  <div className="px-5 py-4 bg-[#f6f3f2] border-b border-[#e2e6ec] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00275a] text-[20px]">
                        manage_search
                      </span>
                      <h2 className="text-base text-[#00275a] font-bold tracking-tight">
                        Quick Inspect &amp; Actions
                      </h2>
                    </div>
                    <span className="text-xs bg-[#f0eded] px-2 py-0.5 rounded text-[#5c6470] font-semibold uppercase tracking-wider">
                      Active Selection
                    </span>
                  </div>

                  {/* Inspector Body */}
                  <div className="p-5 flex flex-col gap-4">
                    {/* Title, Category & Reference */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs uppercase tracking-wider font-bold rounded ${activeNotice.category === 'Placement'
                              ? 'text-[#00696c] bg-[#75f6fb]/50'
                              : activeNotice.category === 'Exam'
                                ? 'text-[#00275a] bg-[#d8e2ff]'
                                : activeNotice.category === 'Event'
                                  ? 'text-[#6f2801] bg-[#ffdbcd]'
                                  : 'text-[#434751] bg-[#f0eded]'
                            }`}
                        >
                          {activeNotice.category}
                        </span>
                        <span className="text-xs bg-[#d8e2ff] text-[#001a41] font-semibold px-2 py-0.5 uppercase tracking-wide rounded">
                          {activeNotice.refNo}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs uppercase tracking-wider font-semibold rounded ml-auto ${activeNotice.status === 'Published'
                              ? 'text-[#10b981] bg-[#ecfdf5] border border-[#a7f3d0]/60'
                              : activeNotice.status === 'Draft'
                                ? 'text-[#ea580c] bg-[#fff7ed] border border-[#fed7aa]/60'
                                : 'text-[#737782] bg-[#f0eded] border border-[#e2e6ec]'
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${activeNotice.status === 'Published'
                                ? 'bg-[#10b981]'
                                : activeNotice.status === 'Draft'
                                  ? 'bg-[#ea580c]'
                                  : 'bg-[#737782]'
                              }`}
                          ></span>
                          <span>{activeNotice.status}</span>
                        </span>
                      </div>

                      <h3 className="text-lg text-[#00275a] font-bold leading-snug">
                        {activeNotice.title}
                      </h3>
                    </div>

                    {/* Action Required Deadline Alert Banner */}
                    {activeNotice.actionRequired && (
                      <div className="p-3 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-lg flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[#ef4444] text-[20px] mt-0.5 shrink-0">
                          alarm
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[13px] text-[#ef4444] font-semibold leading-tight">
                            Action Required: Yes (Deadline: {activeNotice.actionDeadline || 'Oct 26, 05:00 PM'})
                          </span>
                          <span className="text-xs text-[#5c6470] mt-0.5">
                            {activeNotice.actionDescription ||
                              'Mandatory student submission required for validation.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Full Notice Summary Content */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider text-[#5c6470] font-semibold">
                        Summary &amp; Instructions
                      </span>
                      <p className="text-sm text-[#434751] leading-relaxed bg-[#f6f3f2] p-3 rounded border border-[#e2e6ec]/60">
                        {activeNotice.summary}
                      </p>
                    </div>

                    {/* Notice Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#e2e6ec]">
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wider text-[#5c6470] font-semibold">
                          Issued By / Dept
                        </span>
                        <span className="text-sm font-semibold text-[#1c1b1b] mt-0.5">
                          {activeNotice.issuedBy}
                        </span>
                        <span className="text-xs text-[#5c6470]">{activeNotice.department}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wider text-[#5c6470] font-semibold">
                          Published Date &amp; Time
                        </span>
                        <span className="text-sm font-semibold text-[#1c1b1b] mt-0.5">
                          {activeNotice.date}
                        </span>
                        <span className="text-xs text-[#5c6470]">
                          {activeNotice.time} · {activeNotice.targetAudience}
                        </span>
                      </div>
                    </div>

                    {/* Attached Files Section with Download Chips */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-[#5c6470] font-semibold">
                          Attached Documents ({activeNotice.attachments?.length || 0})
                        </span>
                        {activeNotice.attachments && activeNotice.attachments.length > 0 && (
                          <button
                            onClick={() => showToast('All attachments downloaded successfully.')}
                            className="text-xs text-[#00275a] font-medium hover:underline cursor-pointer"
                          >
                            Download All
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {activeNotice.attachments && activeNotice.attachments.length > 0 ? (
                          activeNotice.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              onClick={() => showToast(`Downloading ${file.name}...`)}
                              className="flex items-center justify-between p-2.5 bg-[#f5f7fa] hover:bg-[#f0eded] border border-[#e2e6ec] rounded transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${file.type === 'pdf'
                                      ? 'bg-[#ffdad6]/60 text-[#ef4444]'
                                      : file.type === 'excel'
                                        ? 'bg-[#f0eded] text-[#10b981]'
                                        : 'bg-[#d8e2ff] text-[#00275a]'
                                    }`}
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    {file.type === 'pdf'
                                      ? 'picture_as_pdf'
                                      : file.type === 'excel'
                                        ? 'table_chart'
                                        : 'description'}
                                  </span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-semibold text-[#00275a] group-hover:underline truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-[11px] text-[#5c6470]">
                                    {file.type.toUpperCase()} Document • {file.size}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="p-1.5 text-[#737782] hover:text-[#00275a] hover:bg-[#eae7e7] rounded transition-colors cursor-pointer"
                                title="Download File"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[18px]">download</span>
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-[#f5f7fa] border border-[#e2e6ec] rounded text-xs text-[#5c6470] text-center">
                            No attached documents for this notice.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Ribbon */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#e2e6ec] mt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenEdit(activeNotice)}
                          className="w-full py-2.5 px-3 bg-[#003c84] text-white text-sm font-semibold hover:bg-[#00275a] transition-colors flex items-center justify-center gap-2 shadow-xs rounded cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => showToast(`Resent notifications for ${activeNotice.refNo}.`)}
                          className="w-full py-2.5 px-3 bg-white border border-[#e2e6ec] text-[#1c1b1b] text-sm font-semibold hover:bg-[#f0eded] transition-colors flex items-center justify-center gap-2 rounded cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            notifications_active
                          </span>
                          <span>Resend Notification</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleArchiveNotice(activeNotice.id)}
                          className="py-2 px-3 bg-white border border-[#e2e6ec] text-[#434751] text-xs font-medium hover:bg-[#f0eded] transition-colors flex items-center justify-center gap-1.5 rounded cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">archive</span>
                          <span>Archive</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(activeNotice.id)}
                          className="py-2 px-3 bg-white border border-[#e2e6ec] text-[#ef4444] text-xs font-medium hover:bg-[#ffdad6] transition-colors flex items-center justify-center gap-1.5 rounded cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[#e2e6ec] p-8 text-center text-[#5c6470] shadow-xs">
                  <span className="material-symbols-outlined text-4xl text-[#737782] mb-2">
                    info
                  </span>
                  <p className="text-sm font-semibold text-[#1c1b1b]">No Notice Selected</p>
                  <p className="text-xs mt-1">Select a notice from the workbench list to inspect details.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

