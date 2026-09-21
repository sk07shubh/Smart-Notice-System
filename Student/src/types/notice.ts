export type NoticeCategory = 
  | 'Academic' 
  | 'Examination'
  | 'Exam'
  | 'Placement' 
  | 'Events' 
  | 'Administrative'
  | 'Admin' 
  | 'General' 
  | 'Sports' 
  | 'Library';

export type NavCategoryKey = 'all' | 'exam' | 'placement' | 'general';

export const matchesNavCategory = (noticeCategory: string, categoryKey: string): boolean => {
  if (!categoryKey || categoryKey === 'all') return true;
  const cat = (noticeCategory || '').toLowerCase().trim();
  const key = categoryKey.toLowerCase().trim();
  
  if (key === 'exam' || key === 'examination') {
    return cat === 'exam' || cat === 'examination';
  }
  if (key === 'placement') {
    return cat === 'placement';
  }
  if (key === 'general') {
    return cat === 'general' || cat === 'administrative' || cat === 'admin' || cat === 'academic' || cat === 'events' || cat === 'sports' || cat === 'library';
  }
  return cat === key;
};


export interface Attachment {
  name: string;
  size: string;
  type: 'pdf' | 'excel' | 'image' | 'doc';
  url?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string;
  time?: string;
  summary: string;
  content: string;
  fullBody?: {
    salutation?: string;
    introduction: string;
    sections?: {
      title: string;
      items?: string[];
      paragraphs?: string[];
    }[];
    callout?: string;
    instructions?: string[];
  };
  important?: boolean;
  urgent?: boolean;
  actionRequired?: boolean;
  actionDeadline?: string;
  targetAudience: string;
  department: string;
  departmentKey?: 'ce' | 'it' | 'mech' | 'civil' | 'all';
  issuedBy: string;
  attachments?: Attachment[];
  acknowledged?: boolean;
  bookmarked?: boolean;
  facultyAvatar?: string;
  accentColor?: 'warning' | 'primary' | 'secondary' | 'neutral' | 'error' | 'info';
}

export interface RecentUpdate {
  id: string;
  title: string;
  department: string;
  timeAgo: string;
  category?: NoticeCategory | string;
  noticeId?: string;
  isUrgent?: boolean;
}

export interface CollegeDocument {
  id: string;
  title: string;
  category: string;
  fileType: 'pdf' | 'doc' | 'excel';
  fileSize: string;
  description?: string;
  downloadUrl?: string;
  lastUpdated?: string;
}

export interface FeaturedEvent {
  id: string;
  title: string;
  tag: string;
  image: string;
  shortDescription: string;
  registrationUrl?: string;
  deadlineText: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  isFeatured?: boolean;
  status?: 'open' | 'closing-soon' | 'closed';
}

export interface ScheduleItem {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  subject: string;
  details: string;
  type: 'lecture' | 'lab' | 'break';
  colorBorder: 'primary' | 'secondary' | 'tertiary' | 'muted';
}

export interface ActionItem {
  id: string;
  dateLabel: string;
  title: string;
  noticeId: string;
  type: 'error' | 'warning' | 'info';
}
