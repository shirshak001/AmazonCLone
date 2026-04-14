const Product = require('../models/Product');
const { Op } = require('sequelize');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const where = {};
    if (category && category !== 'All') where.category = category;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) { next(err); }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
};
