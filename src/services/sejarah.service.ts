import api from '../utils/axios';

export interface Sejarah {
    id: number;
    judul: string;
    tanggal_peristiwa: string;
    deskripsi: string;
    gambar_url?: string;
    created_at?: string;
}

export async function getSejarah() {
    const res = await api.get('/api/sejarah');
    return res.data;
}

export async function createSejarah(data: FormData) {
    const res = await api.post('/api/sejarah', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function updateSejarah(id: number, data: FormData) {
    const res = await api.put(`/api/sejarah/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function deleteSejarah(id: number) {
    const res = await api.delete(`/api/sejarah/${id}`);
    return res.data;
}
