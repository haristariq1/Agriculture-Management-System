const { Expense } = require('../models/associations'); const crud = require('../utils/crudFactory')(Expense, 'expense', { prepare: (_req, body) => ({ ...body, cropId: body.cropId || null }), beforeUpdate: (_req, row) => { if (row.sourceType) throw new Error('Linked expenses must be changed through their source record'); }, beforeDelete: (_req, row) => { if (row.sourceType) throw new Error('Linked expenses cannot be deleted directly'); } });
const { ok, fail } = require('../utils/response'); const { Op } = require('sequelize');
crud.payWages = async (req, res) => {
  const { workerId, month } = req.body;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) return fail(res, 'Invalid wage month');
  const { sequelize, Worker, Attendance } = require('../models/associations'); const t = await sequelize.transaction();
  try {
    const worker = await Worker.findByPk(workerId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!worker) { await t.rollback(); return fail(res, 'Worker not found', 404); }
    const [year, monthNumber] = month.split('-').map(Number); const nextMonth = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);
    const rows = await Attendance.findAll({ where: { workerId, date: { [Op.gte]: `${month}-01`, [Op.lt]: nextMonth } }, transaction: t });
    const payableDays = rows.reduce((sum, row) => sum + (row.status === 'Present' ? 1 : row.status === 'Half-day' ? 0.5 : 0), 0); const amount = payableDays * Number(worker.dailyWage);
    if (!(amount > 0)) { await t.rollback(); return fail(res, 'No wages payable'); }
    const existing = await Expense.findOne({ where: { sourceType: 'wage', sourceId: workerId, sourceMonth: month }, transaction: t });
    if (existing) { await t.rollback(); return fail(res, 'Wages already paid for this month', 409); }
    const item = await Expense.create({ category: 'Labour', amount, date: new Date().toISOString().slice(0, 10), note: `${worker.fullName} • ${month}`, sourceType: 'wage', sourceId: workerId, sourceMonth: month }, { transaction: t });
    await require('../utils/crudFactory').logActivity(req, 'add', 'expense', item.id, t); await t.commit(); return ok(res, item, 'Wages paid');
  } catch (e) { await t.rollback(); return fail(res, e.errors?.[0]?.message || e.message, e.name === 'SequelizeUniqueConstraintError' ? 409 : 400); }
};
module.exports = crud;
