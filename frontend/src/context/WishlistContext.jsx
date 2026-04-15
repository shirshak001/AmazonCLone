import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id || item._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => (item.id !== productId && item._id !== productId)));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId || item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
