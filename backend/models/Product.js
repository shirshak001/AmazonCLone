const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: {
      type: String,
      enum: ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports'],
      required: true,
    },
    images: [String],
    description: { type: String, required: true },
    specs: { type: Object, default: {} },
    rating: { type: Number, default: 4.0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    badge: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
