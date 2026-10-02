import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'Draksha Dessert & Café',
    logo: '',
    phone: '+91 98765 43210',
    email: 'contact@draksha.com',
    address: '45 Gourmet Avenue, Chocolate District, Hyderabad, India',
    openingHours: '11:00 AM - 11:30 PM (Everyday)',
    taxRate: 5,
    deliveryFee: 40,
    currency: '₹',
    isOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load restaurant settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        showToast('Restaurant configuration saved successfully!', 'success');
      }
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-brand-muted text-xs">Loading restaurant settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-ivory">Restaurant Settings</h1>
        <p className="text-xs text-brand-muted mt-1">Configure global store details, tax rates, delivery fee, and open/closed status</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl text-xs">
        {/* Store Open / Closed Toggle */}
        <div className="p-4 bg-brand-dark rounded-2xl border border-brand-border flex items-center justify-between">
          <div>
            <strong className="font-serif text-base text-brand-ivory block">Restaurant Operational Status</strong>
            <span className="text-[11px] text-brand-muted">
              Toggle whether the cafe is currently accepting orders on the website
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
            className={`px-4 py-2 rounded-xl font-bold uppercase text-xs transition shadow-md ${
              settings.isOpen
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                : 'bg-rose-950 text-rose-400 border border-rose-500/50'
            }`}
          >
            {settings.isOpen ? 'Store Open (ON)' : 'Store Closed (OFF)'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-muted mb-1 font-medium">Restaurant Name</label>
            <input
              type="text"
              required
              value={settings.restaurantName}
              onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-brand-muted mb-1 font-medium">Contact Phone</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-brand-muted mb-1 font-medium">Contact Email</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-brand-muted mb-1 font-medium">Opening Hours</label>
            <input
              type="text"
              required
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-brand-muted mb-1 font-medium">Full Location Address</label>
            <textarea
              rows={2}
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-brand-muted mb-1 font-medium">GST Tax Percentage (%)</label>
            <input
              type="number"
              required
              min={0}
              max={100}
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-brand-muted mb-1 font-medium">Delivery Fee (₹)</label>
            <input
              type="number"
              required
              min={0}
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-3 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-brand-border/60 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-105 transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
