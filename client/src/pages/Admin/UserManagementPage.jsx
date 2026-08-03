import React, { useState } from 'react';
import { Users, Search, Shield, UserCheck, Trash2, Edit2 } from 'lucide-react';
import { useUsers, useUpdateUserRole, useDeleteUser } from '../../hooks/useErpQueries';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const UserManagementPage = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [newRole, setNewRole] = useState('Customer');

  const { data: res, isLoading } = useUsers({ role: roleFilter, search });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System User Management</h1>
          <p className="text-xs text-slate-400">Manage ERP user accounts, assign roles (Admin, Staff, Technician, Customer)</p>
        </div>

        <div className="flex items-center space-x-2">
          {['All', 'Admin', 'Staff', 'Technician', 'Customer'].map((r) => {
            const isSelected = (roleFilter === '' && r === 'All') || roleFilter === r;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r === 'All' ? '' : r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <div>
                        <p className="text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          u.role === 'Admin'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : u.role === 'Staff'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : u.role === 'Technician'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(u)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 transition-colors"
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
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="font-bold text-white">{activeUser.name}</p>
              <p className="text-slate-400">{activeUser.email}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                Assign System Access Role *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-semibold"
              >
                <option value="Customer">Customer / Industrial Client</option>
                <option value="Technician">Service Technician</option>
                <option value="Staff">Sales & Operations Staff</option>
                <option value="Admin">System Administrator</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md"
              >
                Save Role
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
