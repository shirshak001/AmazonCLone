const Order = require('../models/Order');
const { Cart, CartItem } = require('../models/Cart');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

// POST /api/orders
exports.placeOrder = async (req, res, next) => {
  try {
    const { address } = req.body;
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(400).json({ success: false, message: 'No session found' });

    const cart = await Cart.findOne({
      where: { sessionId },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const items = cart.items.map(i => ({
      productId: i.productId,
      name: i.product.name,
      image: i.product.images[0],
      price: parseFloat(i.product.price),
      quantity: i.quantity,
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 499 ? 0 : 40;
    const total = subtotal + shipping;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);

    const rawId = uuidv4().replace(/-/g, '').toUpperCase().slice(0, 16);
    const order = await Order.create({
      orderId: rawId,
      items,
      address,
      subtotal,
      shipping,
      total,
      estimatedDelivery: deliveryDate,
    });

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ where: { orderId: req.params.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
