import api from './axios';

// Public technician onboarding
export const applyAsTechnicianApi = async (applicationData) => {
  return await api.post('/technician/apply', applicationData);
};

export const getTechnicianApplicationStatusApi = async (email) => {
  return await api.post('/technician/application/status', { email });
};

// Admin technician request management (Admin only — enforced by the backend)
export const getTechnicianRequestsApi = async (params = {}) => {
  return await api.get('/admin/technician-requests', { params });
};

export const getTechnicianRequestApi = async (id) => {
  return await api.get(`/admin/technician-requests/${id}`);
};

export const approveTechnicianRequestApi = async (id) => {
  return await api.patch(`/admin/technician-requests/${id}/approve`);
};

export const rejectTechnicianRequestApi = async (id, rejectionReason) => {
  return await api.patch(`/admin/technician-requests/${id}/reject`, { rejectionReason });
};
