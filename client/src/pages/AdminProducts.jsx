import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, PlusCircle, Trash, Star, Flame, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [imageAuditFilter, setImageAuditFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [image, setImage] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [variants, setVariants] = useState([{ name: 'Regular', price: 100 }]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isImageVerified, setIsImageVerified] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { showToast } = useToast();

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, subRes] = await Promise.all([
        api.get('/products?includeUnavailable=true'),
        api.get('/categories?includeInactive=true'),
        api.get('/subcategories?includeInactive=true'),
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (subRes.data.success) setSubcategories(subRes.data.data);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    const firstCat = categories.length > 0 ? categories[0]._id : '';
    setCategoryId(firstCat);
    setSubcategoryId('');
    setImage('');
    setFoodType('veg');
    setVariants([
      { name: 'Single', price: 80 },
      { name: 'Double', price: 150 },
      { name: 'Full', price: 280 },
    ]);
    setIsAvailable(true);
    setIsFeatured(false);
    setIsPopular(false);
    setIsImageVerified(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description || '');
    const catId = typeof prod.categoryId === 'object' ? prod.categoryId._id : prod.categoryId;
    const subId = typeof prod.subcategoryId === 'object' ? prod.subcategoryId?._id : prod.subcategoryId;
    setCategoryId(catId);
    setSubcategoryId(subId || '');
    setImage(prod.image || '');
    setFoodType(prod.foodType);
    setVariants(prod.variants && prod.variants.length > 0 ? prod.variants : [{ name: 'Regular', price: 0 }]);
    setIsAvailable(prod.isAvailable);
    setIsFeatured(prod.isFeatured);
    setIsPopular(prod.isPopular);
    setIsImageVerified(prod.isImageVerified !== undefined ? prod.isImageVerified : true);
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setImage(res.data.url);
        showToast('Food image uploaded successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddVariantRow = () => {
    setVariants([...variants, { name: '', price: 0 }]);
  };

  const handleRemoveVariantRow = (index) => {
    if (variants.length <= 1) {
      showToast('Product must have at least one pricing variant', 'error');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: field === 'price' ? Number(value) : value };
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      showToast('Product Name and Category are required', 'error');
      return;
    }

    if (variants.some((v) => !v.name.trim() || v.price < 0)) {
      showToast('All variant names must be non-empty and prices non-negative', 'error');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        description,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        image,
        foodType,
        variants,
        isAvailable,
        isFeatured,
        isPopular,
        isImageVerified,
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) showToast('Product updated successfully!', 'success');
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) showToast('Product created successfully!', 'success');
      }

      setModalOpen(false);
      fetchProductsData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const res = await api.put(`/products/${product._id}`, {
        isAvailable: !product.isAvailable,
      });
      if (res.data.success) {
        showToast(
          `Product '${product.name}' is now ${!product.isAvailable ? 'Available' : 'Unavailable'}`,
          'info'
        );
        fetchProductsData();
      }
    } catch (error) {
      showToast('Failed to toggle availability', 'error');
    }
  };

  const handleToggleImageVerification = async (product) => {
    try {
      const nextState = product.isImageVerified !== undefined ? !product.isImageVerified : false;
      const res = await api.put(`/products/${product._id}`, {
        isImageVerified: nextState,
      });
      if (res.data.success) {
        showToast(
          `Image status for '${product.name}' marked as ${nextState ? 'Verified' : 'Review Required'}`,
          'info'
        );
        fetchProductsData();
      }
    } catch (error) {
      showToast('Failed to update image verification status', 'error');
    }
  };

  const handleDeleteProduct = async (id, prodName) => {
    if (!window.confirm(`Delete product '${prodName}' permanently?`)) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        showToast('Product deleted from database', 'success');
        fetchProductsData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const filteredSubcategories = subcategories.filter((sub) => {
    const parentId = typeof sub.categoryId === 'object' ? sub.categoryId._id : sub.categoryId;
    return parentId === categoryId;
  });

  const displayedProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'all') {
      const catId = typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId;
      if (catId !== selectedCategoryFilter) return false;
    }
    if (imageAuditFilter === 'verified' && !p.isImageVerified) return false;
    if (imageAuditFilter === 'unverified' && p.isImageVerified) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-ivory">Menu Items Management</h1>
          <p className="text-xs text-brand-muted mt-1">Live MongoDB product catalog manager & complete food image audit system</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-card p-4 rounded-2xl border border-brand-border/80">
        <input
          type="text"
          placeholder="Filter products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 bg-brand-dark border border-brand-border text-brand-ivory text-xs rounded-xl p-2.5 outline-none"
        />

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-brand-muted font-medium">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-brand-dark border border-brand-border text-brand-ivory text-xs rounded-xl p-2.5 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-brand-muted font-medium">Image Audit:</span>
            <select
              value={imageAuditFilter}
              onChange={(e) => setImageAuditFilter(e.target.value)}
              className="bg-brand-dark border border-brand-border text-brand-ivory text-xs rounded-xl p-2.5 outline-none"
            >
              <option value="all">All Images</option>
              <option value="verified">✓ Verified Images</option>
              <option value="unverified">⚠️ Needs Audit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-brand-muted text-xs">Loading product catalog...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="p-8 text-center text-brand-muted text-xs">No products found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-muted uppercase text-[10px] bg-brand-dark/40">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Item Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Sizes & Prices</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Image Audit</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-brand-ivory">
                {displayedProducts.map((p) => {
                  const catName = typeof p.categoryId === 'object' ? p.categoryId.name : 'Category';
                  const isVerified = p.isImageVerified !== undefined ? p.isImageVerified : true;
                  return (
                    <tr key={p._id} className="hover:bg-brand-dark/50 transition">
                      <td className="py-3 px-4">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-brand-border"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-sm text-brand-gold">
                        {p.name}
                        {p.isFeatured && (
                          <span className="ml-2 text-[9px] bg-brand-gold text-brand-dark px-1.5 py-0.5 rounded font-extrabold uppercase">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-ivory">{catName}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v, idx) => (
                            <span
                              key={idx}
                              className="bg-brand-dark border border-brand-border px-2 py-0.5 rounded text-[10px]"
                            >
                              {v.name}: <strong className="text-brand-gold">₹{v.price}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.foodType === 'veg'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {p.foodType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAvailability(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center space-x-1 ${
                            p.isAvailable
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/40 hover:bg-rose-900'
                          }`}
                        >
                          {p.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.isAvailable ? 'Available' : 'Unavailable'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleImageVerification(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 transition ${
                            isVerified
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-500/40 hover:bg-amber-900'
                          }`}
                          title="Click to toggle image audit verification status"
                        >
                          {isVerified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>✓ Image Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              <span>⚠️ Review Needed</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-brand-gold text-brand-ivory"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-rose-500 text-rose-400"
                          title="Delete Item"
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

      {/* Item Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                {editingProduct ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-brand-muted hover:text-brand-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Section 1: Basic Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-brand-gold uppercase tracking-wider text-[11px]">
                  1. Basic Details
                </h3>

                <div>
                  <label className="block text-brand-muted mb-1 font-medium">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Oreo Waffle"
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1 font-medium">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Crispy Belgian waffle loaded with crushed Oreo cookies..."
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Classification */}
              <div className="space-y-3">
                <h3 className="font-bold text-brand-gold uppercase tracking-wider text-[11px]">
                  2. Category Classification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-brand-muted mb-1 font-medium">Category *</label>
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
                    <label className="block text-brand-muted mb-1 font-medium">Subcategory (Optional)</label>
                    <select
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                    >
                      <option value="">None / Direct Item</option>
                      {filteredSubcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Image */}
              <div className="space-y-3">
                <h3 className="font-bold text-brand-gold uppercase tracking-wider text-[11px]">
                  3. Food Image
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL..."
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                  />
                  <label className="inline-flex items-center space-x-2 bg-brand-dark border border-brand-border px-3 py-2 rounded-xl text-brand-gold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Section 4: Variants & Pricing Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-brand-gold uppercase tracking-wider text-[11px]">
                    4. Sizes & Pricing Variants
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs text-brand-gold hover:underline flex items-center space-x-1 font-bold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Size Variant</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((variant, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-brand-dark p-2.5 rounded-xl border border-brand-border">
                      <div className="flex-1">
                        <label className="text-[10px] text-brand-muted block">Size Name (e.g. Single / Double / Full / 4 pcs)</label>
                        <input
                          type="text"
                          required
                          value={variant.name}
                          onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                          placeholder="Variant Name"
                          className="w-full bg-transparent text-brand-ivory outline-none font-semibold"
                        />
                      </div>
                      <div className="w-32">
                        <label className="text-[10px] text-brand-muted block">Price (₹)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={variant.price}
                          onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          className="w-full bg-transparent text-brand-gold font-bold outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="text-rose-400 p-1 hover:bg-rose-950 rounded"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Settings */}
              <div className="space-y-3 pt-2 border-t border-brand-border/60">
                <h3 className="font-bold text-brand-gold uppercase tracking-wider text-[11px]">
                  5. Item Settings & Badges
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-brand-muted mb-1 font-medium">Food Type</label>
                    <select
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-2.5 outline-none"
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-muted mb-1 font-medium">Availability</label>
                    <select
                      value={isAvailable ? 'true' : 'false'}
                      onChange={(e) => setIsAvailable(e.target.value === 'true')}
                      className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-2.5 outline-none"
                    >
                      <option value="true">Available (ON)</option>
                      <option value="false">Unavailable (OFF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-muted mb-1 font-medium">Featured Item</label>
                    <select
                      value={isFeatured ? 'true' : 'false'}
                      onChange={(e) => setIsFeatured(e.target.value === 'true')}
                      className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-2.5 outline-none"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes (Show Hero/Home)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-muted mb-1 font-medium">Popular Item</label>
                    <select
                      value={isPopular ? 'true' : 'false'}
                      onChange={(e) => setIsPopular(e.target.value === 'true')}
                      className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-2.5 outline-none"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes (Show Popular)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-muted mb-1 font-medium">Image Audit Status</label>
                    <select
                      value={isImageVerified ? 'true' : 'false'}
                      onChange={(e) => setIsImageVerified(e.target.value === 'true')}
                      className="w-full bg-brand-dark border border-brand-border text-brand-ivory rounded-xl p-2.5 outline-none"
                    >
                      <option value="true">✓ Image Verified</option>
                      <option value="false">⚠️ Review Needed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-brand-border text-brand-muted hover:text-brand-ivory text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-105 transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
