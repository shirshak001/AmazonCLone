import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../services/api';
import { MOCK_PRODUCTS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import ImageCarousel from '../components/ImageCarousel';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import { BsFillStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { FiShield, FiTruck, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
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
    if (ok) toast.success('Added to cart!');
    else toast.error('Could not add to cart');
  };

  const handleBuyNow = async () => {
    setAdding(true);
    await addToCart(product._id || product.id, qty);
    setAdding(false);
    navigate('/cart');
  };

  if (loading) return <><Navbar /><Spinner /></>;
  if (!product) return <><Navbar /><div className="page-container"><p>Product not found.</p></div></>;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;

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
            <p className="buy-delivery">FREE Delivery by Tomorrow</p>
            <p className="buy-stock" style={{ color: product.stock > 10 ? '#007600' : '#b12704' }}>
              {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of stock'}
            </p>

            {/* Quantity */}
            <div className="buy-qty">
              <label>Qty:</label>
              <select value={qty} onChange={e => setQty(+e.target.value)} className="qty-select">
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>

            <button className="buy-add-cart" onClick={handleAddToCart} disabled={adding || product.stock === 0} id="btn-add-cart-detail">
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="buy-now" onClick={handleBuyNow} disabled={adding || product.stock === 0} id="btn-buy-now">
              Buy Now
            </button>

            <div className="buy-trust">
              <div className="trust-item"><FiShield /> Secure transaction</div>
              <div className="trust-item"><FiTruck /> Sold by Amazon.in</div>
              <div className="trust-item"><FiRefreshCw /> 10-day returns</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
