const { Activity } = require('../models/associations'); const { ok, fail } = require('../utils/response');
exports.getAll = async (_req, res) => { try { return ok(res, await Activity.findAll({ order: [['timestamp', 'DESC']], limit: 1000 })); } catch (e) { return fail(res, e.message, 500); } };
