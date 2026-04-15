const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    subtotal: Number,
    shipping: Number,
    total: Number,
    status: {
      type: String,
      enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered'],
      default: 'Confirmed',
    },
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
