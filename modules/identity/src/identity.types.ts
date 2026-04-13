export type UserRole = 'admin' | 'sales_rep' | 'warehouse' | 'finance' | 'viewer';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  lang: 'en' | 'zh-HK';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  lang?: 'en' | 'zh-HK';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  id: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'passwordHash'>;
}
