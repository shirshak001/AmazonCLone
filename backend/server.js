require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./db');

// Import models to register associations
require('./models/Product');
require('./models/Cart');  // registers Cart, CartItem and associations
require('./models/Order');
require('./models/User');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', db: 'SQLite', timestamp: new Date() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false })
  .then(() => {
    console.log('[OK] SQLite connected & tables synced');
    app.listen(PORT, () => console.log(`[OK] Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('[ERROR] DB connection failed:', err.message);
    process.exit(1);
  });
