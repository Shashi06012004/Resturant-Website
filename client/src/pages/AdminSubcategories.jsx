import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  // Form
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, subRes] = await Promise.all([
        api.get('/categories?includeInactive=true'),
        api.get('/subcategories?includeInactive=true'),
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (subRes.data.success) setSubcategories(subRes.data.data);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSubcategory(null);
    setCategoryId(categories.length > 0 ? categories[0]._id : '');
    setName('');
    setDescription('');
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubcategory(sub);
    const parentId = typeof sub.categoryId === 'object' ? sub.categoryId._id : sub.categoryId;
    setCategoryId(parentId);
    setName(sub.name);
    setDescription(sub.description || '');
    setIsActive(sub.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId || !name.trim()) {
      showToast('Parent Category and Subcategory name are required', 'error');
      return;
    }

    try {
      const payload = { categoryId, name: name.trim(), description, isActive };

      if (editingSubcategory) {
        const res = await api.put(`/subcategories/${editingSubcategory._id}`, payload);
        if (res.data.success) showToast('Subcategory updated successfully!', 'success');
      } else {
        const res = await api.post('/subcategories', payload);
        if (res.data.success) showToast('Subcategory created successfully!', 'success');
      }

      setModalOpen(false);
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete subcategory '${name}'?`)) return;
    try {
      const res = await api.delete(`/subcategories/${id}`);
      if (res.data.success) {
        showToast('Subcategory deleted', 'success');
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete subcategory', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-ivory">Subcategory Management</h1>
          <p className="text-xs text-brand-muted mt-1">Manage secondary groups like Chocolate Fountain Dips under Brownies</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subcategory</span>
        </button>
      </div>

      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-brand-muted text-xs">Loading subcategories...</div>
        ) : subcategories.length === 0 ? (
          <div className="p-8 text-center text-brand-muted text-xs">No subcategories defined.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-muted uppercase text-[10px] bg-brand-dark/40">
                  <th className="py-3.5 px-4">Subcategory Name</th>
                  <th className="py-3.5 px-4">Parent Category</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-brand-ivory">
                {subcategories.map((sub) => {
                  const parentName = typeof sub.categoryId === 'object' ? sub.categoryId.name : 'Unknown';
                  return (
                    <tr key={sub._id} className="hover:bg-brand-dark/50 transition">
                      <td className="py-3 px-4 font-bold text-sm text-brand-gold">{sub.name}</td>
                      <td className="py-3 px-4 text-brand-ivory font-semibold">{parentName}</td>
                      <td className="py-3 px-4 text-brand-muted max-w-xs truncate">{sub.description || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                          }`}
                        >
                          {sub.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-brand-gold text-brand-ivory"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id, sub.name)}
                          className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-rose-500 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-brand-muted hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-muted mb-1 font-medium">Parent Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chocolate Fountain Dips"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Subcategory description..."
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold"
                >
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
