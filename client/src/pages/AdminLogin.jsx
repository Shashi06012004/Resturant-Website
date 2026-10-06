import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/admin/login', { email, password });
      if (res.data.success) {
        login(res.data.data);
        showToast('Admin authenticated successfully', 'success');
        navigate('/admin');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Admin authentication failed.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-card border border-brand-border p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-gold to-brand-goldHover flex items-center justify-center shadow-gold">
            <ShieldAlert className="w-7 h-7 text-brand-dark" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-ivory">Admin Portal</h1>
          <p className="text-xs text-brand-muted">Authenticate to manage Draksha menu & orders</p>
        </div>

        
        <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-brand-muted mb-1 font-medium">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder='sample@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 pl-10 outline-none"
              />
              <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-brand-muted mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder='*******'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 pl-10 outline-none"
              />
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-[1.01] transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
