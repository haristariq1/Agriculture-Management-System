require('dotenv').config();
const { test } = require('node:test'); const assert = require('node:assert/strict'); const request = require('supertest'); const { app } = require('../app'); const { sequelize, Crop, Buyer, Worker, Attendance, Expense, Equipment, Maintenance, Activity, Inventory } = require('../models/associations');

test('authenticated farm workflows, permissions, validation, linked expenses, and persistence', async () => {
  await sequelize.authenticate(); await sequelize.sync({ alter: true });
  const adminLogin = await request(app).post('/api/users/login').send({ username: 'admin', password: 'Admin@123' }).expect(200);
  const managerLogin = await request(app).post('/api/users/login').send({ username: 'manager', password: 'Manager@123' }).expect(200);
  const admin = adminLogin.body.user; const manager = managerLogin.body.user;
  assert.equal(admin.role, 'admin'); assert.ok(admin.token); assert.equal(manager.role, 'manager');
  await request(app).get('/api/crops').expect(401);
  const signupName = `newmanager${Date.now()}`;
  const signup = await request(app).post('/api/users/register').send({ fullName: 'Registered Manager', username: signupName, email: `${signupName}@example.test`, password: 'secret123' }).expect(201);
  assert.equal(signup.body.data.role, 'manager');
  await request(app).post('/api/users/register').send({ fullName: 'Duplicate Manager', username: signupName, email: `${signupName}@example.test`, password: 'secret123' }).expect(409);
  const signedUp = await request(app).post('/api/users/login').send({ username: signupName, password: 'secret123' }).expect(200);
  await request(app).get('/api/users/me').set('Authorization', `Bearer ${signedUp.body.user.token}`).expect(200);
  const managedUser = await request(app).post('/api/users').set('Authorization', `Bearer ${admin.token}`).send({ fullName: 'Managed Account', username: `managed${Date.now()}`, email: `managed${Date.now()}@example.test`, password: 'secret123', role: 'manager' }).expect(201);
  await request(app).get('/api/users').set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).get(`/api/users/${managedUser.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).get('/api/users').set('Authorization', `Bearer ${manager.token}`).expect(403);
  await request(app).put(`/api/users/${managedUser.body.data.id}`).set('Authorization', `Bearer ${manager.token}`).send({ fullName: 'Blocked Edit' }).expect(403);
  await request(app).delete(`/api/users/${managedUser.body.data.id}`).set('Authorization', `Bearer ${manager.token}`).expect(403);
  await request(app).put(`/api/users/${managedUser.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ fullName: 'Updated Managed Account' }).expect(200);

  const suffix = Date.now().toString();
  const cropData = { name: `Test Crop ${suffix}`, field: 'Test Field', plantingDate: '2026-01-01', cuttingDate: '2026-12-01', healthScore: 80, status: 'Healthy', expectedQty: 20, harvestQty: 10 };
  const createdCrop = await request(app).post('/api/crops').set('Authorization', `Bearer ${admin.token}`).send(cropData).expect(201);
  const cropId = createdCrop.body.data.id;
  await request(app).get('/api/crops').set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).get(`/api/crops/${cropId}`).set('Authorization', `Bearer ${manager.token}`).expect(200);
  await request(app).post('/api/crops').set('Authorization', `Bearer ${manager.token}`).send({ ...cropData, name: `Manager Crop ${suffix}` }).expect(201);
  await request(app).put(`/api/crops/${cropId}`).set('Authorization', `Bearer ${manager.token}`).send({ name: 'Denied edit' }).expect(403);
  await request(app).delete(`/api/crops/${cropId}`).set('Authorization', `Bearer ${manager.token}`).expect(403);
  await request(app).put(`/api/crops/${cropId}`).set('Authorization', `Bearer ${admin.token}`).send({ healthScore: 82 }).expect(200);

  const order = await request(app).post('/api/orders').set('Authorization', `Bearer ${manager.token}`).send({ cropId, quantity: 2, orderDate: new Date().toISOString().slice(0, 10), status: 'Pending' }).expect(201);
  await request(app).get('/api/orders').set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).put(`/api/orders/${order.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'Delivered' }).expect(200);
  await request(app).delete(`/api/orders/${order.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  const manualExpense = await request(app).post('/api/expenses').set('Authorization', `Bearer ${manager.token}`).send({ cropId: '', category: 'Other', amount: 120, date: new Date().toISOString().slice(0, 10), note: 'Test operating cost' }).expect(201);
  await request(app).get('/api/expenses').set('Authorization', `Bearer ${admin.token}`).expect(200);
  assert.equal(manualExpense.body.data.cropId, null);
  await request(app).put(`/api/expenses/${manualExpense.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ amount: 125 }).expect(200);
  await request(app).delete(`/api/expenses/${manualExpense.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);

  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/x8cAAAAASUVORK5CYII=', 'base64');
  const buyerRequest = () => request(app).post('/api/buyers').set('Authorization', `Bearer ${manager.token}`).field('name', 'Test Buyer').field('cnic', `35202-${suffix.slice(-7).padStart(7, '0')}-1`).field('cropId', cropId).field('quantity', '6').field('date', new Date().toISOString().slice(0, 10)).field('unitPrice', '50').attach('photo', image, { filename: 'buyer.png', contentType: 'image/png' });
  const buyer = await buyerRequest().expect(201); const buyerId = buyer.body.data.id;
  await request(app).get('/api/buyers').set('Authorization', `Bearer ${admin.token}`).expect(200);
  assert.match(buyer.body.data.photoUrl, /^\/images\/.+\.png$/);
  await request(app).get(buyer.body.data.photoUrl).expect(200).expect('Content-Type', /image\/png/);
  await buyerRequest().expect(409);
  const editedBuyer = await request(app).put(`/api/buyers/${buyerId}`).set('Authorization', `Bearer ${admin.token}`).field('quantity', '8').expect(200);
  assert.equal(editedBuyer.body.data.photoUrl, buyer.body.data.photoUrl);
  await request(app).post('/api/buyers').set('Authorization', `Bearer ${manager.token}`).field('name', 'Another Buyer').field('cnic', `35202-${String(Number(suffix.slice(-7)) + 1).slice(-7).padStart(7, '0')}-1`).field('cropId', cropId).field('quantity', '5').field('date', new Date().toISOString().slice(0, 10)).attach('photo', image, { filename: 'buyer.png', contentType: 'image/png' }).expect(400);
  await request(app).post('/api/buyers').set('Authorization', `Bearer ${manager.token}`).field('name', 'Invalid Buyer').field('cnic', 'invalid').field('cropId', cropId).field('quantity', '1').field('date', new Date().toISOString().slice(0, 10)).attach('photo', image, { filename: 'buyer.gif', contentType: 'image/gif' }).expect(400);
  await request(app).post('/api/buyers').set('Authorization', `Bearer ${manager.token}`).field('name', 'Large Image Buyer').field('cnic', `35204-${suffix.slice(-7).padStart(7, '0')}-1`).field('cropId', cropId).field('quantity', '1').field('date', new Date().toISOString().slice(0, 10)).attach('photo', Buffer.alloc(1024 * 1024 + 1), { filename: 'large.png', contentType: 'image/png' }).expect(400);

  await request(app).post('/api/workers').set('Authorization', `Bearer ${admin.token}`).send({ fullName: 'Wrong Phone', cnic: `35205-${suffix.slice(-7).padStart(7, '0')}-1`, phone: '123', role: 'Farm Hand', dailyWage: 1500, joinDate: new Date().toISOString().slice(0, 10), status: 'Active' }).expect(400);

  const workerResult = await request(app).post('/api/workers').set('Authorization', `Bearer ${admin.token}`).send({ fullName: 'Farm Worker', cnic: `35203-${suffix.slice(-7).padStart(7, '0')}-1`, phone: '03001234567', role: 'Farm Hand', dailyWage: 1500, joinDate: new Date().toISOString().slice(0, 10), status: 'Active' }).expect(201);
  await request(app).get('/api/workers').set('Authorization', `Bearer ${admin.token}`).expect(200);
  const workerId = workerResult.body.data.id; const today = new Date().toISOString().slice(0, 10); const month = today.slice(0, 7);
  await request(app).put(`/api/workers/${workerId}`).set('Authorization', `Bearer ${admin.token}`).send({ role: 'Supervisor' }).expect(200);
  await request(app).post('/api/attendance').set('Authorization', `Bearer ${manager.token}`).send({ workerId, date: today, status: 'Present' }).expect(201);
  await request(app).get('/api/attendance').set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).post('/api/attendance').set('Authorization', `Bearer ${manager.token}`).send({ workerId, date: today, status: 'Absent' }).expect(409);
  const presentAttendance = await Attendance.findOne({ where: { workerId, date: today } });
  await request(app).put(`/api/attendance/${presentAttendance.id}`).set('Authorization', `Bearer ${admin.token}`).send({ note: 'Checked in' }).expect(200);
  const wage = await request(app).post('/api/attendance').set('Authorization', `Bearer ${admin.token}`).send({ workerId, date: `${month}-01`, status: 'Absent' }).expect(201);
  await request(app).put(`/api/attendance/${wage.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'Half-day' }).expect(200);
  const disposableAttendance = await request(app).post('/api/attendance').set('Authorization', `Bearer ${manager.token}`).send({ workerId, date: `${month}-02`, status: 'Leave' }).expect(201);
  await request(app).delete(`/api/attendance/${disposableAttendance.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  assert.ok(wage.body.data.id);
  const paid = await request(app).post('/api/expenses/pay-wages').set('Authorization', `Bearer ${admin.token}`).send({ workerId, month, amount: 1 }).expect(200);
  assert.equal(Number(paid.body.data.amount), 2250);
  await request(app).post('/api/expenses/pay-wages').set('Authorization', `Bearer ${admin.token}`).send({ workerId, month }).expect(409);
  await request(app).put(`/api/attendance/${wage.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'Present' }).expect(400);

  const machine = await request(app).post('/api/equipment').set('Authorization', `Bearer ${manager.token}`).send({ name: `Pump ${suffix}`, type: 'Water Pump', purchaseDate: '2025-01-01', status: 'Active', lastServiceDate: '2026-01-01', serviceIntervalDays: 60 }).expect(201);
  await request(app).get('/api/equipment').set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).put(`/api/equipment/${machine.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'Idle' }).expect(200);
  await request(app).put(`/api/equipment/${machine.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'Active' }).expect(200);
  const service = await request(app).post('/api/maintenance').set('Authorization', `Bearer ${manager.token}`).send({ equipmentId: machine.body.data.id, date: today, description: 'Pump repair', cost: 400, performedBy: 'Test mechanic' }).expect(201);
  await request(app).get('/api/maintenance').set('Authorization', `Bearer ${admin.token}`).expect(200);
  assert.equal((await Equipment.findByPk(machine.body.data.id)).lastServiceDate, today);
  const maintenanceExpense = await Expense.findOne({ where: { sourceType: 'maintenance', sourceId: service.body.data.id } }); assert.equal(Number(maintenanceExpense.amount), 400); assert.equal(maintenanceExpense.category, 'Repair');
  await request(app).put(`/api/maintenance/${service.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ cost: 600 }).expect(200);
  assert.equal(await Expense.count({ where: { sourceType: 'maintenance', sourceId: service.body.data.id } }), 1);
  assert.equal(Number((await Expense.findOne({ where: { sourceType: 'maintenance', sourceId: service.body.data.id } })).amount), 600);

  const overdue = await request(app).post('/api/tasks').set('Authorization', `Bearer ${manager.token}`).send({ title: `Past task ${suffix}`, type: 'Irrigation', dueDate: '2020-01-01', status: 'Pending' }).expect(201);
  const taskList = await request(app).get('/api/tasks').set('Authorization', `Bearer ${admin.token}`).expect(200);
  assert.equal(taskList.body.data.find((row) => row.id === overdue.body.data.id).status, 'Overdue');
  await request(app).put(`/api/tasks/${overdue.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'Done' }).expect(200);

  const inventory = await request(app).post('/api/inventory').set('Authorization', `Bearer ${manager.token}`).send({ item: `Seed ${suffix}`, type: 'Seed', qty: 10, minQty: 2, unit: 'kg' }).expect(201);
  await request(app).get('/api/inventory').set('Authorization', `Bearer ${admin.token}`).expect(200);
  const used = await request(app).post(`/api/inventory/${inventory.body.data.id}/usage`).set('Authorization', `Bearer ${manager.token}`).send({ quantity: 3, date: today, note: 'Field use' }).expect(200);
  assert.equal(Number(used.body.data.qty), 7);
  await request(app).put(`/api/inventory/${inventory.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).send({ minQty: 4 }).expect(200);

  const activity = await request(app).get('/api/activity').set('Authorization', `Bearer ${manager.token}`).expect(200);
  assert.ok(activity.body.data.some((row) => row.user === 'manager' && row.action === 'add' && row.entity === 'buyer'));
  assert.ok(await Buyer.findByPk(buyerId)); assert.ok(await Crop.findByPk(cropId));

  await request(app).delete(`/api/maintenance/${service.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  assert.equal(await Expense.count({ where: { sourceType: 'maintenance', sourceId: service.body.data.id } }), 0);
  assert.equal((await Equipment.findByPk(machine.body.data.id)).lastServiceDate, '2026-01-01');
  await request(app).delete(`/api/buyers/${buyerId}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).delete(`/api/tasks/${overdue.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).delete(`/api/inventory/${inventory.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).delete(`/api/equipment/${machine.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  await request(app).delete(`/api/crops/${cropId}`).set('Authorization', `Bearer ${admin.token}`).expect(200);
  await Crop.destroy({ where: { name: `Manager Crop ${suffix}` } }); await Attendance.destroy({ where: { workerId } }); await Expense.destroy({ where: { sourceType: 'wage', sourceId: workerId } }); await request(app).delete(`/api/workers/${workerId}`).set('Authorization', `Bearer ${admin.token}`).expect(200); await request(app).delete(`/api/users/${managedUser.body.data.id}`).set('Authorization', `Bearer ${admin.token}`).expect(200); await require('../models/associations').User.destroy({ where: { username: signupName } });
  assert.ok(await Activity.count({ where: { user: 'manager' } }));
  await sequelize.close();
});
