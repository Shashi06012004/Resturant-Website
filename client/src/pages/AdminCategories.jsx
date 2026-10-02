import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories?includeInactive=true'),
        api.get('/products?includeUnavailable=true'),
      ]);
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
      if (prodRes.data.success) {
        const counts = {};
        prodRes.data.data.forEach((p) => {
          const catId = typeof p.categoryId === 'object' ? p.categoryId?._id : p.categoryId;
          if (catId) {
            counts[catId] = (counts[catId] || 0) + 1;
          }
        });
        setProductCounts(counts);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('');
    setIsActive(true);
    setDisplayOrder(categories.length + 1);
    setModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setImage(category.image || '');
    setIsActive(category.isActive);
    setDisplayOrder(category.displayOrder || 0);
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setImage(res.data.url);
        showToast('Category image uploaded successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        description,
        image,
        isActive,
        displayOrder,
      };

      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, payload);
        if (res.data.success) {
          showToast('Category updated successfully!', 'success');
        }
      } else {
        const res = await api.post('/categories', payload);
        if (res.data.success) {
          showToast('Category created successfully!', 'success');
        }
      }

      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category '${catName}'?`)) return;

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        showToast('Category deleted successfully', 'success');
        fetchCategories();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-ivory">Category Management</h1>
          <p className="text-xs text-brand-muted mt-1">Add, edit, or disable menu categories in MongoDB</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Data Table */}
      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-brand-muted text-xs">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-brand-muted text-xs">No categories found in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-muted uppercase text-[10px] bg-brand-dark/40">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-brand-ivory">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-brand-dark/50 transition">
                    <td className="py-3 px-4">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=200&q=80'}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover border border-brand-border"
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-sm text-brand-gold">{cat.name}</td>
                    <td className="py-3 px-4 font-bold text-brand-ivory">{productCounts[cat._id] || 0}</td>
                    <td className="py-3 px-4 max-w-xs text-brand-muted truncate">{cat.description || 'N/A'}</td>
                    <td className="py-3 px-4 font-mono">{cat.displayOrder}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          cat.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-brand-gold text-brand-ivory transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-rose-500 text-rose-400 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-brand-muted hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-muted mb-1 font-medium">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Special Desserts"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short category description..."
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none resize-none"
                />
              </div>

              {/* Image Upload & URL */}
              <div>
                <label className="block text-brand-muted mb-1 font-medium">Category Image</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or upload below"
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-brand-dark hover:bg-brand-card border border-brand-border text-brand-gold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1 font-medium">Active Status</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-muted hover:text-brand-ivory text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-105 transition"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
