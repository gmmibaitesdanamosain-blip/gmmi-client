import api from '../utils/axios';

// --- Pengumuman ---
export async function getPengumuman() {
  const res = await api.get('/api/announcements');
  return res.data; // Array of pengumuman
}

export async function addPengumuman(data: { isi: string }) {
  const res = await api.post('/api/announcements', data);
  return res.data; // Pengumuman baru
}

// --- Statistik ---
export async function getStatistik() {
  const res = await api.get('/dashboard/statistik');
  return res.data;
}

// --- Warta ---
export async function getWarta() {
  const res = await api.get('/api/warta');
  return res.data;
}

// --- Arsip ---
export async function getArsip() {
  const res = await api.get('/api/arsip');
  return res.data;
}

// --- Jadwal ---
export async function getJadwal() {
  const res = await api.get('/api/jadwal');
  return res.data;
}