import React, { useState } from 'react';
import { api } from '../api';

export interface AdminSession { token: string; user: { id: string; name: string; role: 'ADMIN' | 'FACULTY' } }

export const LoginScreen: React.FC<{ onLogin: (session: AdminSession) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { onLogin(await api<AdminSession>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); }
    finally { setLoading(false); }
  };
  return <main className="min-h-screen bg-[#f5f7fa] flex items-center justify-center p-4">
    <form onSubmit={submit} className="w-full max-w-md bg-white rounded-xl border border-[#e2e6ec] shadow-xl p-7 flex flex-col gap-5">
      <div><p className="text-[#003c84] font-bold text-xl">ICEM Admin Portal</p><p className="text-sm text-[#5c6470] mt-1">Sign in with an administrator or faculty account.</p></div>
      {error && <p role="alert" className="rounded bg-red-50 text-red-700 p-3 text-sm">{error}</p>}
      <label className="text-sm font-semibold">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full border rounded p-2.5" /></label>
      <label className="text-sm font-semibold">Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5 w-full border rounded p-2.5" /></label>
      <button disabled={loading} className="rounded bg-[#003c84] py-2.5 text-white font-semibold disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </main>;
};
