import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  onSuccess: () => void; // called after successful creation
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({ isOpen, onClose, token, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentId, setAttachmentId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load categories when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        setCategories(data.data || []);
        if (data.data?.length) setCategoryId(data.data[0].id);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, [isOpen]);

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachmentFile(file);
    if (!token) {
      setError('You must be logged in to upload files');
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      setAttachmentId(result.data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!token) {
      setError('Authentication required');
      return;
    }
    try {
      setLoading(true);
      const payload: any = {
        title,
        description,
        categoryId,
        isPinned,
      };
      if (attachmentId) payload.attachmentIds = [attachmentId];

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Failed to create notice');
      }
      setSuccessMsg('Notice created successfully');
      // Notify parent to refresh data
      onSuccess();
      // Close after short delay
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737782] hover:text-[#1c1b1b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#00275a] mb-2">Create New Notice</h2>
          {error && (
            <div className="p-3 mb-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 mb-3 text-sm text-green-700 bg-green-50 rounded-lg border border-green-100">
              {successMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1c1b1b] mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-[#e2e6ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c84] focus:border-transparent transition-all"
                placeholder="Notice title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c1b1b] mb-1">Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                minLength={1}
                className="w-full px-3 py-2 border border-[#e2e6ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c84] focus:border-transparent transition-all"
                rows={4}
                placeholder="Detail the notice..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c1b1b] mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e6ec] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003c84] transition-all"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="pinned"
                type="checkbox"
                checked={isPinned}
                onChange={e => setIsPinned(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="pinned" className="text-sm text-[#1c1b1b]">Mark as important / pinned</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c1b1b] mb-1">Attachment (optional)</label>
              <input type="file" accept="*" onChange={handleFileChange} className="w-full" />
              {attachmentId && (
                <p className="mt-1 text-xs text-[#5c6470]">Uploaded attachment id: {attachmentId}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003c84] hover:bg-[#00275a] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Notice'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
