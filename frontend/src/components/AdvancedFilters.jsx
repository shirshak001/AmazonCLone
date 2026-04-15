import React, { useState } from 'react';

export default function AdvancedFilters({ onFilterChange, products }) {
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  // Get unique ratings from products
  const ratings = [5, 4, 3, 2, 1];

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
    onFilterChange({ priceRange: [0, value], ratings: selectedRatings, sortBy });
  };

  const handleRatingChange = (rating) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
    onFilterChange({ priceRange, ratings: updated, sortBy });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onFilterChange({ priceRange, ratings: selectedRatings, sortBy: value });
  };

  return (
    <div className="advanced-filters">
      <div className="filter-section">
        <h4>Price Range</h4>
        <input 
          type="range" 
          min="0" 
          max="200000" 
          step="10000"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-display">
          ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
        </div>
      </div>

      <div className="filter-section">
        <h4>Customer Ratings</h4>
        <div className="ratings-filter">
          {ratings.map(rating => (
            <label key={rating} className="rating-checkbox">
              <input 
                type="checkbox" 
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
              />
              <span>★ {rating} & up</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select value={sortBy} onChange={handleSortChange} className="sort-select">
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
}
