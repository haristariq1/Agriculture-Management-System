import client from '../client';
const uiUser = (user) => user ? { ...user, role: user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : user.role } : user;
const wrap = (data, message = 'OK') => ({ data: { succeeded: true, message, data } });
export async function login(username, password) { const response = await client.post('/users/login', { username, password }); const user = uiUser(response.data.user); return wrap(user, response.data.message); }
export const logout = () => client.post('/users/logout');
export async function register(data) { const response = await client.post('/users/register', data); return { ...response, data: { ...response.data, data: uiUser(response.data.data) } }; }
export async function getAllUsers() { const response = await client.get('/users'); return wrap((response.data.data.users || []).map(uiUser), response.data.message); }
export async function getUser(id) { const response = await client.get(`/users/${id}`); return { ...response, data: { ...response.data, data: uiUser(response.data.data) } }; }
export async function create(data) { const response = await client.post('/users', { ...data, role: data.role?.toLowerCase() }); return { ...response, data: { ...response.data, data: uiUser(response.data.data) } }; }
export async function updateUser(data) { const payload = { ...data }; delete payload.id; if (payload.role) payload.role = payload.role.toLowerCase(); const response = await client.put(`/users/${data.id}`, payload); return { ...response, data: { ...response.data, data: uiUser(response.data.data) } }; }
export const removeUser = (id) => client.delete(`/users/${typeof id === 'string' ? id : id.id}`);
