import React, { useState } from 'react';
import { Wrench, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const ServicesManager = () => {
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit'
  const [selectedService, setSelectedService] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wiring & Earthing');
  const [estimatedDuration, setEstimatedDuration] = useState('2 Hours');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { data: res, isLoading } = useServices({ search });
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const services = res?.data || [];

  const handleOpenCreate = () => {
    setSelectedService(null);
    setTitle('');
    setCategory('Wiring & Earthing');
    setEstimatedDuration('2 Hours');
    setEstimatedPrice(0);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60');
    setActiveModal('create');
  };

  const handleOpenEdit = (s) => {
    setSelectedService(s);
    setTitle(s.title);
    setCategory(s.category);
    setEstimatedDuration(s.estimatedDuration);
    setEstimatedPrice(s.estimatedPrice);
    setDescription(s.description);
    setImageUrl(s.imageUrl);
    setActiveModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'create') {
        await createMutation.mutateAsync({
          title,
          category,
          estimatedDuration,
          estimatedPrice: Number(estimatedPrice),
          description,
          imageUrl
        });
      } else {
        await updateMutation.mutateAsync({
          id: selectedService._id,
          data: {
            title,
            category,
            estimatedDuration,
            estimatedPrice: Number(estimatedPrice),
            description,
            imageUrl
          }
        });
      }
      setActiveModal(null);
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete service entry?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Household Electrical Services Master</h1>
          <p className="text-xs text-slate-500">Configure residential wiring, geyser repair, fan installation & switchboard services</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-card"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner message="Loading services catalog..." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Service</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Est. Duration</th>
                  <th className="px-4 py-2.5">Est. Fee</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 flex items-center space-x-3">
                      <img src={s.imageUrl} alt={s.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{s.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-orange-600">{s.category}</td>
                    <td className="px-4 py-2.5 text-slate-500">{s.estimatedDuration}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900 text-sm">{formatCurrency(s.estimatedPrice)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(s)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal === 'create' ? 'Create Service Offering' : 'Edit Service Offering'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Category *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Est. Duration *</label>
              <input
                type="text"
                required
                placeholder="2 Hours"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Estimated Fee (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Cover Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Detailed Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold shadow-card"
            >
              Save Service Entry
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
