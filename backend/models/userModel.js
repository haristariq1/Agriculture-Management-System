const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING(80), allowNull: false, validate: { len: [2, 80] } },
  username: { type: DataTypes.STRING(40), allowNull: false, unique: true, validate: { len: [3, 40] } },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 100] } },
  role: { type: DataTypes.ENUM('admin', 'manager'), allowNull: false, defaultValue: 'manager' },
}, { tableName: 'users', timestamps: true });
User.beforeValidate((user) => { if (user.username) user.username = user.username.trim().toLowerCase(); if (user.email) user.email = user.email.trim().toLowerCase(); });
const hashPassword = async (user) => { if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10); };
User.beforeCreate(hashPassword); User.beforeUpdate(hashPassword);
User.prototype.matchPassword = function matchPassword(password) { return bcrypt.compare(password, this.password); };
module.exports = User;
