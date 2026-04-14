const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Cart session table
const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sessionId: { type: DataTypes.STRING(255), allowNull: false, unique: true },
}, { tableName: 'carts', timestamps: true });

// CartItem join table
const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cartId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
}, { tableName: 'cart_items', timestamps: false });

// Associations
const Product = require('./Product');
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = { Cart, CartItem };
