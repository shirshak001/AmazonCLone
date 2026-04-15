import React, { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiStar } from 'react-icons/fi';

export default function Reviews({ productId = 'PROD001' }) {
  const [reviews] = useState([
    {
      id: 1,
      author: 'Rahul Kumar',
      rating: 5,
      title: 'Excellent product! Highly recommended',
      text: 'Amazing quality and fast delivery. The product is exactly as described. Will buy again!',
      date: '2024-02-10',
      verified: true,
      helpful: 234,
      unhelpful: 8,
    },
    {
      id: 2,
      author: 'Priya Singh',
      rating: 4,
      title: 'Great value for money',
      text: 'Very good product. Packing could be better but overall satisfied with the purchase. Delivery was on time.',
      date: '2024-02-08',
      verified: true,
      helpful: 156,
      unhelpful: 12,
    },
    {
      id: 3,
      author: 'Amit Patel',
      rating: 5,
      title: 'Perfect! Exactly what I wanted',
      text: 'Premium quality, great performance. Customer service was also very helpful. 10/10 would recommend!',
      date: '2024-02-05',
      verified: true,
      helpful: 89,
      unhelpful: 2,
    },
  ]);

  const [sortBy, setSortBy] = useState('recent');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating-high') return b.rating - a.rating;
    if (sortBy === 'rating-low') return a.rating - b.rating;
    return new Date(b.date) - new Date(a.date);
  });

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div style={{ paddingTop: '32px', borderTop: '1px solid #f0f0f0' }}>
      {/* Reviews Header */}
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
        Reviews
      </h2>

      {/* Rating Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '32px',
          marginBottom: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left: Rating Box */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#0f1111' }}>
            {avgRating}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '8px 0' }}>
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={16}
                fill={i < Math.round(avgRating) ? '#f0a500' : '#ccc'}
                color={i < Math.round(avgRating) ? '#f0a500' : '#ccc'}
              />
            ))}
          </div>
          <div style={{ fontSize: '13px', color: '#565959' }}>
            Based on {reviews.length} reviews
          </div>
          <button
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '10px',
              background: '#febd69',
              color: '#0f1111',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#f3a847')}
            onMouseLeave={(e) => (e.target.style.background = '#febd69')}
          >
            Write a Review
          </button>
        </div>

        {/* Right: Rating Distribution */}
        <div>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage = (count / reviews.length) * 100;
            return (
              <div
                key={star}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '12px', minWidth: '40px', color: '#565959' }}>
                  {star} <FiStar size={12} style={{ display: 'inline' }} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: '8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: '#f0a500',
                      width: `${percentage}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#565959', minWidth: '30px' }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sort Options */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 600 }}>
          All ({reviews.length})
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d5d9d9',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            style={{
              padding: '16px',
              border: '1px solid #e7e7e7',
              borderRadius: '6px',
              backgroundColor: '#fafafa',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#febd69';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e7e7e7';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Review Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1px' }}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        fill={i < review.rating ? '#f0a500' : '#ccc'}
                        color={i < review.rating ? '#f0a500' : '#ccc'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }}>
                    {review.title}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#565959',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  <span>By {review.author}</span>
                  {review.verified && (
                    <span
                      style={{
                        color: '#007600',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      [Verified] Verified Purchase
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>

            {/* Review Text */}
            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333',
                margin: '12px 0',
              }}
            >
              {review.text}
            </p>

            {/* Helpful/Unhelpful */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e3e3e3',
              }}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#565959',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  transition: 'all 0.2s',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.color = '#0066c0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#565959';
                }}
              >
                <FiThumbsUp size={14} />
                Helpful ({review.helpful})
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#565959',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  transition: 'all 0.2s',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.color = '#0066c0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#565959';
                }}
              >
                <FiThumbsDown size={14} />
                Not helpful ({review.unhelpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
