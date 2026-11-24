const { Op } = require("sequelize");
const { User } = require("../models/associations");
const { ok, fail } = require("../utils/response");
const generateToken = require("../utils/generateToken");
const { logActivity } = require("../utils/crudFactory");
const safe = (u) => ({
  id: u.id,
  fullName: u.fullName,
  username: u.username,
  email: u.email,
  role: u.role,
});
exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const role = String(req.body.role || "manager")
      .trim()
      .toLowerCase();
    if (
      ![fullName, username, email, password].every(
        (x) => typeof x === "string" && x.trim()
      )
    )
      return fail(res, "All fields are required");
    if (password.length < 6)
      return fail(res, "Password must be at least 6 characters");
    if (!["admin", "manager"].includes(role))
      return fail(res, "Role must be Admin or Manager");
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({
      where: {
        [Op.or]: [{ username: normalizedUsername }, { email: normalizedEmail }],
      },
    });
    if (exists) return fail(res, "Username or email already in use", 409);
    const user = await User.create({
      fullName: fullName.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role,
    });
    await logActivity(req, "add", "user", user.id);
    return ok(
      res,
      safe(user),
      "Account created. The new user can now log in.",
      201
    );
  } catch (e) {
    return fail(
      res,
      e.errors?.[0]?.message || e.message,
      e.name === "SequelizeUniqueConstraintError" ? 409 : 400
    );
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return fail(res, "Username and password are required");
    const user = await User.findOne({
      where: { [Op.or]: [{ username }, { email: username.toLowerCase() }] },
    });
    if (!user || !(await user.matchPassword(password)))
      return fail(res, "Invalid username or password", 401);
    return res.json({
      succeeded: true,
      message: "Login successful",
      user: { ...safe(user), token: generateToken(user) },
    });
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
exports.me = (req, res) => ok(res, safe(req.user));
exports.logout = (_req, res) => ok(res, null, "Logged out");
exports.getAllUsers = async (_req, res) => {
  try {
    return ok(res, {
      users: await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
      }),
    });
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
exports.getUser = async (req, res) => {
  const u = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password"] },
  });
  return u ? ok(res, u) : fail(res, "User not found", 404);
};
exports.createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;
    const user = await User.create({
      fullName,
      username,
      email,
      password,
      role,
    });
    await logActivity(req, "add", "user", user.id);
    return ok(res, safe(user), "User created", 201);
  } catch (e) {
    return fail(
      res,
      e.errors?.[0]?.message || e.message,
      e.name === "SequelizeUniqueConstraintError" ? 409 : 400
    );
  }
};
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return fail(res, "User not found", 404);
    if (user.id === req.user.id && req.body.role && req.body.role !== user.role)
      return fail(res, "You cannot change your own role");
    await user.update(req.body);
    await logActivity(req, "edit", "user", user.id);
    return ok(res, safe(user), "User updated");
  } catch (e) {
    return fail(
      res,
      e.errors?.[0]?.message || e.message,
      e.name === "SequelizeUniqueConstraintError" ? 409 : 400
    );
  }
};
exports.removeUser = async (req, res) => {
  if (req.params.id === req.user.id)
    return fail(res, "You cannot delete your own account");
  const user = await User.findByPk(req.params.id);
  if (!user) return fail(res, "User not found", 404);
  await User.destroy({ where: { id: req.params.id } });
  await logActivity(req, "delete", "user", req.params.id);
  return ok(res, { id: req.params.id }, "User removed");
};
