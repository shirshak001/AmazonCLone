import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../services/api';
import { MOCK_PRODUCTS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import ImageCarousel from '../components/ImageCarousel';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Reviews from '../components/Reviews';
import RelatedProducts from '../components/RelatedProducts';
import { BsFillStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { FiShield, FiTruck, FiRefreshCw, FiCheckCircle, FiMinus, FiPlus, FiHeart } from 'react-icons/fi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import toast from 'react-hot-toast';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => i <= rating ? <BsFillStarFill key={i} className="star filled" /> : rating >= i-0.5 ? <BsStarHalf key={i} className="star filled" /> : <BsStar key={i} className="star" />)}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct(id)
      .then(res => setProduct(res.data.data))
      .catch(() => {
        // Fall back to mock data
        const mock = MOCK_PRODUCTS.find(p => p.id === id);
        if (mock) setProduct(mock);
        else toast.error('Product not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    const ok = await addToCart(product._id || product.id, qty);
    setAdding(false);
    if (ok) {
      toast.success(`Added ${qty} item(s) to cart!`);
    } else {
      toast.error('Could not add to cart');
    }
  };

  const handleBuyNow = async () => {
    setAdding(true);
    const ok = await addToCart(product._id || product.id, qty);
    setAdding(false);
    if (ok) navigate('/cart');
  };

  const toggleWishlist = () => {
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) return <><Navbar /><Spinner /></>;
  if (!product) return <><Navbar /><div className="page-container"><p>Product not found.</p></div></>;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;
  const inStock = product.stock > 0;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="detail-breadcrumb">
          <span onClick={() => navigate(-1)} className="breadcrumb-back">← Back to results</span>
          <span> &gt; {product.category}</span>
        </div>

        <div className="detail-layout">
          {/* Image Carousel */}
          <div className="detail-images">
            <ImageCarousel images={product.images || []} />
          </div>

          {/* Info Column */}
          <div className="detail-info">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <h1 className="detail-title">{product.name}</h1>
            <div className="detail-rating">
              <StarRating rating={product.rating} />
              <span className="review-count">{(product.reviews || 0).toLocaleString()} ratings</span>
            </div>
            <hr className="detail-divider" />

            {/* Price */}
            <div className="detail-price-block">
              <span className="detail-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className="detail-original">M.R.P: <s>₹{product.originalPrice.toLocaleString('en-IN')}</s></span>
                  {discount && <span className="detail-discount">Save {discount}%</span>}
                </>
              )}
            </div>

            {product.price > 499 ? (
              <p className="detail-delivery"><FiCheckCircle size={13} style={{verticalAlign:'middle',marginRight:4}} /> FREE Delivery. Details</p>
            ) : (
              <p className="detail-delivery"><FiTruck size={13} style={{verticalAlign:'middle',marginRight:4}} /> ₹40 delivery fee</p>
            )}

            <p className="detail-description">{product.description}</p>
            <hr className="detail-divider" />

            {/* Specs */}
            {specs && Object.keys(specs).length > 0 && (
              <div className="detail-specs">
                <h3>Technical Details</h3>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(specs).map(([k, v]) => (
                      <tr key={k}><td className="spec-key">{k}</td><td className="spec-val">{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="buy-box">
            <div className="buy-price">₹{product.price.toLocaleString('en-IN')}</div>
            <p className="buy-delivery">[OK] FREE Delivery by Tomorrow</p>
            <p className={`buy-stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
              {inStock ? (product.stock > 10 ? '[OK] In stock' : `[OK] Only ${product.stock} left!`) : '[X] Out of stock'}
            </p>

            <hr className="buy-divider" />

            {/* Quantity Control */}
            <div className="buy-qty-control">
              <label>Quantity:</label>
              <div className="qty-counter">
                <button 
                  className="qty-counter-btn" 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1 || !inStock}
                >
                  <FiMinus />
                </button>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock || 10))}
                  className="qty-input"
                  disabled={!inStock}
                />
                <button 
                  className="qty-counter-btn" 
                  onClick={() => setQty(Math.min(product.stock || 10, qty + 1))}
                  disabled={qty >= (product.stock || 10) || !inStock}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <hr className="buy-divider" />

            <button 
              className={`buy-add-cart ${adding ? 'loading' : ''} ${!inStock ? 'disabled' : ''}`}
              onClick={handleAddToCart} 
              disabled={adding || !inStock}
              id="btn-add-cart-detail"
            >
              {adding ? (
                <>
                  <span className="spinner-mini" /> Adding...
                </>
              ) : (
                <>
                  <AiOutlineShoppingCart /> Add to Cart
                </>
              )}
            </button>

            <button 
              className={`buy-now ${adding ? 'loading' : ''} ${!inStock ? 'disabled' : ''}`}
              onClick={handleBuyNow} 
              disabled={adding || !inStock}
              id="btn-buy-now"
            >
              {adding ? 'Processing...' : 'Buy Now'}
            </button>

            <button 
              className={`buy-wishlist ${inWishlist ? 'saved' : ''}`}
              onClick={toggleWishlist}
              title="Add to wishlist"
            >
              <FiHeart /> {inWishlist ? 'Saved' : 'Save for later'}
            </button>

            <div className="buy-trust">
              <div className="trust-item">
                <FiShield size={16} />
                <span>Secure transaction</span>
              </div>
              <div className="trust-item">
                <FiTruck size={16} />
                <span>Returns within 10 days</span>
              </div>
              <div className="trust-item">
                <FiCheckCircle size={16} />
                <span>Fulfilled by Amazon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Reviews productId={product._id || product.id} />

        {/* Related Products Section */}
        <RelatedProducts 
          category={product.category} 
          productId={product._id || product.id}
          onAddToCart={addToCart}
        />
      </div>
    </>
  );
}
