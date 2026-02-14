import api from '../utils/axios';

export async function getKeuanganSummary() {
    const res = await api.get('/api/keuangan/summary');
    return res.data;
}

export async function getTransactions(startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await api.get('/api/keuangan', { params });
    return res.data;
}

export async function createTransaction(data: any) {
    const res = await api.post('/api/keuangan', data);
    return res.data;
}

export async function deleteTransaction(id: string) {
    const res = await api.delete(`/api/keuangan/${id}`);
    return res.data;
}

export function exportTransactions(startDate?: string, endDate?: string) {
    let url = `/api/keuangan/export`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    // Use api.getBlob or just window.open. 
    // Since we need auth token, window.open might fail if token is not in cookie.
    // Better to use axios to download blob.

    api.get(url, { responseType: 'blob' })
        .then((response) => {
            const href = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'Laporan_Keuangan_GMMI.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => console.error("Export failed", error));
}
