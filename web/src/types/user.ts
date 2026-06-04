export type UserRole = 'passenger' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}
