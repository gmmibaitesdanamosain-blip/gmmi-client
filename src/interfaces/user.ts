export type UserRole = 'admin' | 'super_admin' | 'superadmin' | 'admin_majelis' | 'user';

export interface User {
  nama: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}