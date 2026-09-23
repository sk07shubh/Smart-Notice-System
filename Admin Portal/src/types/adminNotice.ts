export type NoticeStatus = 'Published' | 'Archived' | 'Draft';

export interface AdminAttachment {
  id?: string;
  name: string;
  size: string;
  type: 'pdf' | 'excel' | 'image' | 'doc';
  url?: string;
}

export interface AdminNotice {
  id: string;
  refNo: string;
  title: string;
  category: 'Placement' | 'Exam' | 'Academic' | 'Event' | 'Admin' | 'General';
  status: NoticeStatus;
  summary: string;
  issuedBy: string;
  department: string;
  departmentKey: 'tpo' | 'exam' | 'comp' | 'it' | 'admin' | 'all';
  date: string;
  time: string;
  targetAudience: string;
  academicYear?: string;
  isImportant?: boolean;
  isUrgent?: boolean;
  actionRequired?: boolean;
  actionDeadline?: string;
  actionDescription?: string;
  attachments: AdminAttachment[];
}

export interface AdminFilterState {
  search: string;
  category: string;
  department: string;
  statusTab: 'all' | 'published' | 'draft' | 'action_required';
  dateFilter?: string;
  selectedDate?: string;
}
