import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: { id: string; name: string; role: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737782] hover:text-[#1c1b1b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-[#00275a] mb-1">Admin Login</h2>
          <p className="text-sm text-[#5c6470] mb-6">Sign in to manage notices and events.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1c1b1b] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#e2e6ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c84] focus:border-transparent transition-all"
                placeholder="admin@college.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1c1b1b] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#e2e6ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c84] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003c84] hover:bg-[#00275a] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
