import api from '../utils/axios';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  role: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

type RegisterPayload = {
  nama: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin_majelis';
};

export async function register(payload: RegisterPayload) {
  const response = await api.post('/api/admin/register', payload);
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export async function getProfile() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const response = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}