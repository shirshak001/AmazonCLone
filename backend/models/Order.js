const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  items: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  address: { type: DataTypes.JSONB, allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2) },
  shipping: { type: DataTypes.DECIMAL(10, 2) },
  total: { type: DataTypes.DECIMAL(12, 2) },
  status: {
    type: DataTypes.ENUM('Confirmed', 'Processing', 'Shipped', 'Delivered'),
    defaultValue: 'Confirmed',
  },
  estimatedDelivery: { type: DataTypes.DATE },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
