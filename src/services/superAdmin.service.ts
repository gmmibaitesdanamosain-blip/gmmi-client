import api from '../utils/axios';

// --- Dashboard Summary ---
export async function getSuperAdminSummary() {
    const res = await api.get('/api/super-admin/summary');
    return res.data;
}

// --- Admin Management ---
export async function getAdmins() {
    const res = await api.get('/api/admin');
    return res.data;
}

export async function createAdmin(data: any) {
    const res = await api.post('/api/admins', data);
    return res.data;
}

export async function updateAdmin(id: string, data: any) {
    const res = await api.put(`/api/admins/${id}`, data);
    return res.data;
}

export async function resetAdminPassword(id: string) {
    const res = await api.post(`/api/admins/reset-password`, { id });
    return res.data;
}

export async function changeMyPassword(id: string, currentPassword: string, newPassword: string) {
    const res = await api.post(`/api/admins/change-password`, { id, currentPassword, newPassword });
    return res.data;
}

export async function toggleAdminStatus(id: string, isActive: boolean) {
    const res = await api.patch(`/api/admins/${id}/status`, { isActive });
    return res.data;
}

// --- Announcements (National) ---
export async function getAllAnnouncements() {
    const res = await api.get('/api/announcements/all'); // Assuming endpoint for all announcements
    return res.data;
}

// --- Warta (All Branches) ---
export async function getAllWarta(filters?: any) {
    const res = await api.get('/api/pewartaan', { params: filters });
    return res.data;
}

export async function updateWartaStatus(id: string, status: 'approved' | 'rejected') {
    const res = await api.patch(`/api/pewartaan/${id}/status`, { status });
    return res.data;
}

export async function deleteWarta(id: string) {
    const res = await api.delete(`/api/pewartaan/${id}`);
    return res.data;
}

// --- Arsip (Archives) ---
export async function getArsipBulanan(bulan: number, tahun: number) {
    const res = await api.get('/api/arsip', { params: { bulan, tahun } });
    return res.data;
}

// --- Agenda (Jadwal Pelayanan) ---
export async function getAgenda() {
    const res = await api.get('/api/jadwal');
    return res.data;
}

export async function createAgenda(data: any) {
    const res = await api.post('/api/jadwal', data);
    return res.data;
}

export async function updateAgenda(id: string, data: any) {
    const res = await api.put(`/api/jadwal/${id}`, data);
    return res.data;
}

export async function deleteAgenda(id: string) {
    const res = await api.delete(`/api/jadwal/${id}`);
    return res.data;
}
