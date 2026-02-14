import api from '../utils/axios';

// --- Generic Admin Tasks ---
export async function getSummary() {
    const res = await api.get('/api/admin/summary');
    return res.data;
}

// --- Announcements ---
export async function getAnnouncements() {
    const res = await api.get('/api/announcements');
    return res.data;
}

export async function createAnnouncement(data: { isi: string; status: 'publish' | 'draft' }) {
    const res = await api.post('/api/announcements', data);
    return res.data;
}

export async function updateAnnouncement(id: string, data: { isi: string; status: 'publish' | 'draft' }) {
    const res = await api.put(`/api/announcements/${id}`, data);
    return res.data;
}

export async function deleteAnnouncement(id: string) {
    const res = await api.delete(`/api/announcements/${id}`);
    return res.data;
}

// --- Warta (Weekly News) ---
export async function getWarta(page: number = 1, limit: number = 10) {
    const res = await api.get(`/api/warta?page=${page}&limit=${limit}`);
    return res.data;
}

export async function createWarta(formData: FormData) {
    const res = await api.post('/api/warta', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function updateWarta(id: string, formData: FormData) {
    const res = await api.put(`/api/warta/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function deleteWarta(id: string) {
    const res = await api.delete(`/api/warta/${id}`);
    return res.data;
}

// --- Jadwal (Schedules) ---
export async function getJadwal() {
    const res = await api.get('/api/jadwal');
    return res.data;
}

export async function createJadwal(data: any) {
    const res = await api.post('/api/jadwal', data);
    return res.data;
}

export async function updateJadwal(id: string, data: any) {
    const res = await api.put(`/api/jadwal/${id}`, data);
    return res.data;
}

export async function deleteJadwal(id: string) {
    const res = await api.delete(`/api/jadwal/${id}`);
    return res.data;
}

// --- Arsip (Archives) ---
export async function getArsip(bulan?: string, tahun?: string) {
    const res = await api.get(`/api/arsip`, { params: { bulan, tahun } });
    return res.data;
}
