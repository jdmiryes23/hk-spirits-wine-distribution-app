export type AccountStatus = 'active' | 'inactive' | 'prospect' | 'suspended';
export type AccountTier = 'A' | 'B' | 'C' | 'D';
export type ActivityType = 'visit' | 'call' | 'email' | 'order' | 'sample' | 'note';

export interface Account {
  id: string;
  tenantId: string;
  code: string;
  nameEn: string;
  nameZh?: string;
  status: AccountStatus;
  tier: AccountTier;
  district: string;  // HK district e.g. 'Central', 'Wan Chai'
  address: string;
  phone?: string;
  email?: string;
  assignedRepId: string;
  creditLimit: number;
  paymentTermsDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface Activity {
  id: string;
  accountId: string;
  repId: string;
  type: ActivityType;
  subject: string;
  notes?: string;
  outcome?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface CreateAccountDto {
  code: string;
  nameEn: string;
  nameZh?: string;
  status?: AccountStatus;
  tier?: AccountTier;
  district: string;
  address: string;
  phone?: string;
  email?: string;
  assignedRepId: string;
  creditLimit?: number;
  paymentTermsDays?: number;
}

export interface CreateActivityDto {
  accountId: string;
  type: ActivityType;
  subject: string;
  notes?: string;
  scheduledAt?: string;
}
