import { Account, Contact, Activity, CreateAccountDto, CreateActivityDto } from './crm.types';

// In-memory stores — replace with DB repositories
const accounts: Account[] = [];
const contacts: Contact[] = [];
const activities: Activity[] = [];

export const crmService = {
  // Accounts
  async listAccounts(tenantId: string, repId?: string): Promise<Account[]> {
    return accounts.filter(a => a.tenantId === tenantId && (!repId || a.assignedRepId === repId));
  },

  async getAccount(id: string, tenantId: string): Promise<Account | null> {
    return accounts.find(a => a.id === id && a.tenantId === tenantId) || null;
  },

  async createAccount(dto: CreateAccountDto, tenantId: string): Promise<Account> {
    const exists = accounts.find(a => a.code === dto.code && a.tenantId === tenantId);
    if (exists) throw Object.assign(new Error('Account code already exists'), { statusCode: 409 });
    const account: Account = {
      id: crypto.randomUUID(),
      tenantId,
      code: dto.code,
      nameEn: dto.nameEn,
      nameZh: dto.nameZh,
      status: dto.status || 'prospect',
      tier: dto.tier || 'C',
      district: dto.district,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      assignedRepId: dto.assignedRepId,
      creditLimit: dto.creditLimit ?? 0,
      paymentTermsDays: dto.paymentTermsDays ?? 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    accounts.push(account);
    return account;
  },

  async updateAccount(id: string, tenantId: string, patch: Partial<CreateAccountDto>): Promise<Account> {
    const idx = accounts.findIndex(a => a.id === id && a.tenantId === tenantId);
    if (idx === -1) throw Object.assign(new Error('Account not found'), { statusCode: 404 });
    accounts[idx] = { ...accounts[idx], ...patch, updatedAt: new Date() };
    return accounts[idx];
  },

  // Contacts
  async listContacts(accountId: string): Promise<Contact[]> {
    return contacts.filter(c => c.accountId === accountId);
  },

  // Activities
  async listActivities(accountId: string): Promise<Activity[]> {
    return activities.filter(a => a.accountId === accountId).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  async createActivity(dto: CreateActivityDto, repId: string): Promise<Activity> {
    const activity: Activity = {
      id: crypto.randomUUID(),
      accountId: dto.accountId,
      repId,
      type: dto.type,
      subject: dto.subject,
      notes: dto.notes,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      createdAt: new Date(),
    };
    activities.push(activity);
    return activity;
  },
};
