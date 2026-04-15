import React from 'react';

export default function SkeletonLoader({ type = 'product', count = 4 }) {
  const skeletons = Array(count).fill(0);

  if (type === 'product') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" style={{ width: '80%' }} />
            <div className="skeleton-text" style={{ width: '60%' }} />
          </div>
        ))}
      </>
    );
  }

  if (type === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="skeleton-image-large" />
        <div className="skeleton-content">
          <div className="skeleton-text-large" />
          <div className="skeleton-text" />
          <div className="skeleton-text" style={{ width: '70%' }} />
        </div>
      </div>
    );
  }

  return null;
}
