const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    lowercase: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phone: DataTypes.STRING,
  address: { type: DataTypes.JSONB, defaultValue: {} },
  twoFactorSecret: DataTypes.STRING,
  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  backupCodes: { type: DataTypes.ARRAY(DataTypes.STRING) },
}, {
  tableName: 'users',
  timestamps: true,
});

// Hash password before save
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Method to verify password
User.prototype.verifyPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
