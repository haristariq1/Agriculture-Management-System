const jwt = require('jsonwebtoken'); const { User } = require('../models/associations'); const { fail } = require('../utils/response');
exports.protect = async (req, res, next) => {
  try { const header = req.headers.authorization || ''; const token = header.startsWith('Bearer ') ? header.slice(7) : null; if (!token) return fail(res, 'Not authorized, token missing', 401); const payload = jwt.verify(token, process.env.JWT_SECRET); const user = await User.findByPk(payload.id, { attributes: { exclude: ['password'] } }); if (!user) return fail(res, 'User no longer exists', 401); req.user = user; return next(); }
  catch { return fail(res, 'Invalid or expired token', 401); }
};
exports.authorize = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : fail(res, 'You do not have permission for this action', 403);
