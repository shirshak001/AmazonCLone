const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(500), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  originalPrice: { type: DataTypes.DECIMAL(10, 2) },
  category: {
    type: DataTypes.ENUM('Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports'),
    allowNull: false,
  },
  images: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  description: { type: DataTypes.TEXT, allowNull: false },
  specs: { type: DataTypes.JSONB, defaultValue: {} },
  rating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 4.0 },
  reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, defaultValue: 100 },
  badge: { type: DataTypes.STRING(50) },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
