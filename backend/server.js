require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./db');

// Import models to register associations
require('./models/Product');
const { Cart, CartItem } = require('./models/Cart');
require('./models/Order');
require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

// Setup associations
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const aiChatRoutes = require('./routes/aichat');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiChatRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', db: 'PostgreSQL/MySQL', timestamp: new Date() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Allow server to start even without database initially
// Database will sync in background
let dbConnected = false;

sequelize.sync({ alter: false })
  .then(() => {
    dbConnected = true;
    console.log('[OK] Database synchronized');
  })
  .catch(err => {
    console.error('[WARNING] Database connection failed:', err.message);
    console.log('[INFO] Server will run in limited mode without database');
  });

// Start server immediately
app.listen(PORT, () => {
  console.log(`[OK] Server running on http://localhost:${PORT}`);
  console.log(`[INFO] API: http://localhost:${PORT}/api`);
  console.log(`[INFO] Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[INFO] Shutting down server...');
  process.exit(0);
});
