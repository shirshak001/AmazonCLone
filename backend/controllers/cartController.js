const { Cart, CartItem } = require('../models/Cart');
const Product = require('../models/Product');
const crypto = require('crypto');

const getOrCreateCart = async (sessionId) => {
  const [cart] = await Cart.findOrCreate({ where: { sessionId } });
  return cart;
};

const getSessionId = (req, res) => {
  let sid = req.cookies.sessionId;
  if (!sid) {
    sid = crypto.randomUUID();
    res.cookie('sessionId', sid, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  return sid;
};

const getPopulatedCart = async (cartId) => {
  return Cart.findOne({
    where: { id: cartId },
    include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
  });
};

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req, res);
    const cart = await Cart.findOne({
      where: { sessionId },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });
    if (!cart) return res.json({ success: true, data: { items: [] } });
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
};

// POST /api/cart  { productId, quantity }
exports.addToCart = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req, res);
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const cart = await getOrCreateCart(sessionId);

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity = Math.min(item.quantity + quantity, product.stock);
      await item.save();
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    const populated = await getPopulatedCart(cart.id);
    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// PUT /api/cart/:productId
exports.updateCartItem = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req, res);
    const { quantity } = req.body;
    const cart = await Cart.findOne({ where: { sessionId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    if (quantity <= 0) {
      await CartItem.destroy({ where: { cartId: cart.id, productId: req.params.productId } });
    } else {
      await CartItem.update({ quantity }, { where: { cartId: cart.id, productId: req.params.productId } });
    }

    const populated = await getPopulatedCart(cart.id);
    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// DELETE /api/cart/:productId
exports.removeFromCart = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req, res);
    const cart = await Cart.findOne({ where: { sessionId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    await CartItem.destroy({ where: { cartId: cart.id, productId: req.params.productId } });

    const populated = await getPopulatedCart(cart.id);
    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      const cart = await Cart.findOne({ where: { sessionId } });
      if (cart) await CartItem.destroy({ where: { cartId: cart.id } });
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
};
