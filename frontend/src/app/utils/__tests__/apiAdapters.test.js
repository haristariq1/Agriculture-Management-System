import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../redux/api/client', () => ({ default: { post: vi.fn(), get: vi.fn(), put: vi.fn(), delete: vi.fn() } }));
import client from '../../redux/api/client'; import { create, getAllUsers, login, register, updateUser } from '../../redux/api/users';
const response = (data) => ({ data: { succeeded: true, message: 'OK', data } });

describe('backend API adapters', () => {
  beforeEach(() => vi.clearAllMocks());
  it('normalizes the backend login response for the existing Redux user reducer', async () => {
    client.post.mockResolvedValue({ data: { succeeded: true, message: 'Signed in', user: { id: 'u1', username: 'admin', role: 'admin', token: 'jwt' } } });
    const result = await login('admin', 'password');
    expect(result.data.data).toMatchObject({ id: 'u1', role: 'Admin', token: 'jwt' });
    expect(client.post).toHaveBeenCalledWith('/users/login', { username: 'admin', password: 'password' });
  });
  it('unwraps the user list envelope and normalizes roles', async () => {
    client.get.mockResolvedValue({ data: { succeeded: true, message: 'OK', data: { users: [{ id: 'u2', role: 'manager' }] } } });
    expect((await getAllUsers()).data.data).toEqual([{ id: 'u2', role: 'Manager' }]);
  });
  it('registers managers and maps frontend roles before admin user writes', async () => {
    client.post.mockResolvedValue(response({ id: 'u3', role: 'manager' }));
    await register({ fullName: 'New Manager', username: 'farmmanager', email: 'manager@example.test', password: 'secret123' });
    expect(client.post).toHaveBeenCalledWith('/users/register', { fullName: 'New Manager', username: 'farmmanager', email: 'manager@example.test', password: 'secret123' });
    client.post.mockResolvedValue(response({ id: 'u4', role: 'admin' }));
    await create({ fullName: 'New Admin', username: 'newadmin', email: 'admin@example.test', password: 'secret123', role: 'Admin' });
    expect(client.post).toHaveBeenCalledWith('/users', expect.objectContaining({ role: 'admin' }));
    client.put.mockResolvedValue(response({ id: 'u4', role: 'manager' }));
    expect((await updateUser({ id: 'u4', role: 'Manager' })).data.data.role).toBe('Manager');
    expect(client.put).toHaveBeenCalledWith('/users/u4', { role: 'manager' });
  });
});
