import React, { useState } from 'react';
import { Users, Search, Shield, UserCheck, Trash2, Edit2, Plus } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUserRole, useDeleteUser } from '../../hooks/useErpQueries';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const UserManagementPage = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [newRole, setNewRole] = useState('Customer');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Create User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Staff');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [createError, setCreateError] = useState('');

  const { data: res, isLoading } = useUsers({ role: roleFilter, search });
  const createUserMutation = useCreateUser();
  const updateUserRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  const users = res?.data || [];

  const handleOpenModal = (u) => {
    setActiveUser(u);
    setNewRole(u.role);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!activeUser) return;

    try {
      await updateUserRoleMutation.mutateAsync({
        id: activeUser._id,
        data: { role: newRole }
      });
      setActiveUser(null);
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (newPassword.length < 6) {
      setCreateError('Password must be at least 6 characters');
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newUserRole,
        phone: newPhone,
        address: newAddress
      });
      setCreateModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewUserRole('Staff');
      setNewPhone('');
      setNewAddress('');
    } catch (err) {
      setCreateError(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">System User Management</h1>
          <p className="text-xs text-slate-500">Manage ERP user accounts, assign roles (Admin, Staff, Technician, Customer)</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search & Role Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {['All', 'Admin', 'Staff', 'Technician', 'Customer'].map((r) => {
            const isSelected = (roleFilter === '' && r === 'All') || roleFilter === r;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r === 'All' ? '' : r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching user directory..." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Contact Phone</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Registered Date</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-900">
                      <div>
                        <p className="text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500 font-normal">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 font-semibold">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          u.role === 'Admin'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                            : u.role === 'Staff'
                            ? 'bg-sky-500/10 text-sky-600 border-sky-500/30'
                            : u.role === 'Technician'
                            ? 'bg-amber-50 text-amber-600 border-amber-500/30'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(u)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-200 text-slate-600 font-semibold transition-colors"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 transition-colors"
                      >
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

      {/* Role Edit Modal */}
      <Modal
        isOpen={!!activeUser}
        onClose={() => setActiveUser(null)}
        title={`Change Role: ${activeUser?.name}`}
      >
        {activeUser && (
          <form onSubmit={handleRoleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">{activeUser.name}</p>
              <p className="text-slate-500">{activeUser.email}</p>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">
                Assign System Access Role *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 font-semibold"
              >
                <option value="Customer">Customer / Industrial Client</option>
                <option value="Technician">Service Technician</option>
                <option value="Staff">Sales & Operations Staff</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveUser(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
              >
                Save Role
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Staff / Technician / Customer Account"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {createError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Technician / Staff name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@udayelectrical.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Temporary Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">System Role *</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 font-semibold"
              >
                <option value="Staff">Sales & Operations Staff</option>
                <option value="Technician">Service Technician</option>
                <option value="Customer">Customer / Industrial Client</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 00000"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Address</label>
            <textarea
              rows={2}
              placeholder="Work / service area address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
