import type { Notice, Attachment, NoticeCategory } from '../types/notice';

// ---------------------------------------------------------------------------
// Types that match the raw shape returned by GET /api/notices
// ---------------------------------------------------------------------------
interface ApiAttachment {
  id: string;
  url: string;
  fileName: string;
  fileSize?: number | null;
  mimeType?: string | null;
}

export interface ApiNotice {
  id: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  attachments?: ApiAttachment[];
  postedBy?: { name: string } | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatBytes(bytes?: number | null): string {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function inferAttachmentType(
  mimeType?: string | null,
  fileName?: string
): Attachment['type'] {
  const name = (fileName || '').toLowerCase();
  const mime = (mimeType || '').toLowerCase();
  if (mime.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (
    mime.includes('sheet') ||
    name.endsWith('.xlsx') ||
    name.endsWith('.xls') ||
    name.endsWith('.csv')
  )
    return 'excel';
  if (mime.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/.test(name))
    return 'image';
  return 'doc';
}

/**
 * Map a raw backend notice into the frontend Notice shape.
 * Fields the backend doesn't provide get sensible defaults.
 */
export function mapNotice(api: ApiNotice): Notice {
  const created = new Date(api.createdAt);

  // Normalise category name to a value recognised by NoticeCategory / matchesNavCategory
  const rawCat = api.category?.name ?? 'General';

  return {
    id: api.id,
    title: api.title,
    category: rawCat as NoticeCategory,
    date: created.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: created.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    summary: api.description,
    content: api.description,
    important: api.isPinned,
    urgent: false,
    targetAudience: 'All Students',
    department: 'General',
    departmentKey: 'all',
    issuedBy: api.postedBy?.name ?? 'College Administration',
    attachments: (api.attachments ?? []).map((a) => ({
      name: a.fileName,
      size: formatBytes(a.fileSize),
      type: inferAttachmentType(a.mimeType, a.fileName),
      url: a.url,
    })),
  };
}
