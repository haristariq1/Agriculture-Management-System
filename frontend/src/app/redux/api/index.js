import client from './client';
export const payWage = (worker, month) => client.post('/expenses/pay-wages', { workerId: worker.id, month });
