import client from './client';
export const resource = (url) => ({ get: () => client.get(url), add: (body) => client.post(url, body), update: (body) => client.put(`${url}/${body.id}`, body), remove: (item) => client.delete(`${url}/${typeof item === 'string' ? item : item.id}`) });
