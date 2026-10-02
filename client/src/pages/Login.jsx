import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.data);
        showToast(`Welcome back, ${res.data.data.name}!`, 'success');
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-brand-card border border-brand-border/90 p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-brand-gold to-brand-goldHover flex items-center justify-center shadow-gold">
            <UtensilsCrossed className="w-6 h-6 text-brand-dark" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-ivory">Welcome Back</h1>
          <p className="text-xs text-brand-muted">Sign in to your Draksha account to view orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-brand-muted mb-1 font-medium">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-brand-muted pt-2 border-t border-brand-border/60">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-brand-gold font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
