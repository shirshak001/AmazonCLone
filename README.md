# 🛒 Amazon Clone – E-Commerce Platform

A full-stack e-commerce web application replicating Amazon's design and user experience.

Built as an SDE Intern Fullstack Assignment.

---

## 🚀 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React.js + Vite               |
| Backend    | Node.js + Express             |
| Database   | PostgreSQL + Sequelize ORM    |
| Styling    | Vanilla CSS (Amazon-style)    |
| State Mgmt | React Context API             |

---

## 📁 Project Structure

```
amazon-clone/
  backend/
    models/         Product, Cart, CartItem, Order (Sequelize)
    routes/         products, cart, orders
    controllers/    business logic
    middleware/     error handler
    db.js           Sequelize connection
    server.js       Express entry point
    seed.js         25 sample products seeder
    .env            PostgreSQL credentials
  frontend/
    src/
      components/   Navbar, ProductCard, ImageCarousel, Spinner
      pages/        Home, ProductDetail, Cart, Checkout, OrderConfirmation
      context/      CartContext (global cart state)
      services/     api.js (axios)
```

---

## 🗄️ Database Design

### `products`
| Column        | Type          | Description              |
|---------------|---------------|--------------------------|
| id            | UUID (PK)     | Auto-generated UUID      |
| name          | VARCHAR(500)  | Product name             |
| price         | DECIMAL(10,2) | Current price            |
| originalPrice | DECIMAL(10,2) | MRP / crossed price      |
| category      | ENUM          | Electronics / Books / …  |
| images        | TEXT[]        | Array of image URLs      |
| description   | TEXT          | Full description         |
| specs         | JSONB         | Key-value spec pairs     |
| rating        | DECIMAL(3,1)  | Star rating              |
| reviews       | INTEGER       | Review count             |
| stock         | INTEGER       | Available units          |
| badge         | VARCHAR(50)   | "Best Seller", "New" etc |

### `carts`
| Column    | Type      | Description           |
|-----------|-----------|-----------------------|
| id        | UUID (PK) | Cart ID               |
| sessionId | VARCHAR   | Browser session token |

### `cart_items`
| Column    | Type    | Description             |
|-----------|---------|-------------------------|
| id        | UUID    | Line item ID            |
| cartId    | UUID FK | References `carts.id`   |
| productId | UUID FK | References `products.id`|
| quantity  | INTEGER | Item quantity           |

### `orders`
| Column           | Type          | Description          |
|------------------|---------------|----------------------|
| id               | UUID (PK)     | Internal ID          |
| orderId          | VARCHAR(20)   | Human-readable ID    |
| items            | JSONB         | Snapshot of ordered items |
| address          | JSONB         | Delivery address     |
| subtotal         | DECIMAL(12,2) |                      |
| shipping         | DECIMAL(10,2) | 0 if >₹499           |
| total            | DECIMAL(12,2) |                      |
| status           | ENUM          | Confirmed/Shipped/…  |
| estimatedDelivery| TIMESTAMP     |                      |

---

## ⚙️ API Endpoints

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | /api/products         | List products (search, category filter) |
| GET    | /api/products/:id     | Get single product     |
| GET    | /api/cart             | Get session cart       |
| POST   | /api/cart             | Add item to cart       |
| PUT    | /api/cart/:productId  | Update item quantity   |
| DELETE | /api/cart/:productId  | Remove item from cart  |
| DELETE | /api/cart/clear       | Clear entire cart      |
| POST   | /api/orders           | Place order            |
| GET    | /api/orders/:id       | Get order by ID        |

---

## 🏃 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL running locally (or any PG instance)

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your PostgreSQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amazonclone
DB_USER=postgres
DB_PASSWORD=your_password
```

Seed the database (creates tables + adds 25 products):
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## ✅ Core Features

- **Product Listing** – Grid layout, search, category filter
- **Product Detail** – Image carousel, specs table, buy box with quantity select
- **Shopping Cart** – Session-based, qty +/-, remove, subtotal + total
- **Checkout** – Address form with validation, order summary sidebar
- **Order Confirmation** – Unique order ID, delivery tracking steps

---

## 🌟 Bonus Features

- Responsive design (mobile-friendly)
- Amazon-style UI (color palette, layout, navbar)
- Animated hero banner (auto-rotates every 4s)
- Toast notifications for cart actions
- FREE delivery threshold (orders > ₹499)
- Product badges (Best Seller, New, Deal)

---

## 👨‍💻 Author

Built by Aanya| SDE Intern Assignment
