import type { Attachment } from '../types/notice';

export function getAttachmentUrl(attachment: Attachment): string | null {
  const url = attachment.url?.trim();
  return url ? url : null;
}

export function openAttachment(attachment: Attachment): boolean {
  const url = getAttachmentUrl(attachment);
  if (!url) return false;

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export function downloadAttachment(attachment: Attachment): boolean {
  const url = getAttachmentUrl(attachment);
  if (!url) return false;

  const separator = url.includes('?') ? '&' : '?';
  const link = document.createElement('a');
  // Supabase Storage recognises this query parameter and sends the file as an attachment.
  link.href = `${url}${separator}download=${encodeURIComponent(attachment.name)}`;
  link.download = attachment.name;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}
