import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, CreateUserDto, LoginDto, AuthResponse } from './identity.types';

// In-memory store for scaffold — replace with DB repository
const users: User[] = [];

export const identityService = {
  async register(dto: CreateUserDto, tenantId: string): Promise<Omit<User, 'passwordHash'>> {
    const exists = users.find(u => u.email === dto.email);
    if (exists) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user: User = {
      id: crypto.randomUUID(),
      tenantId,
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      lang: dto.lang || 'en',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    const { passwordHash: _, ...safe } = user;
    return safe;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = users.find(u => u.email === dto.email && u.isActive);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    const secret = process.env.JWT_SECRET || 'changeme';
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, tenantId: user.tenantId },
      secret,
      { expiresIn: '8h' }
    );
    const { passwordHash: _, ...safe } = user;
    return { accessToken, user: safe };
  },

  async getById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...safe } = user;
    return safe;
  },
};
