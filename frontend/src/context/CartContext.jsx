import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi } from '../services/api';
import { MOCK_PRODUCTS } from '../services/mockData';

const CartContext = createContext(null);

// ── Local (in-memory) cart helpers used when backend is offline ──
let localCart = { items: [] }; // items: [{productId: {...product}, quantity}]

function localAddToCart(product, quantity) {
  const existing = localCart.items.find(i => i.productId.id === product.id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock || 99);
  } else {
    localCart = { items: [...localCart.items, { productId: product, quantity }] };
  }
  return { ...localCart };
}

function localUpdateQty(productId, quantity) {
  if (quantity <= 0) {
    localCart = { items: localCart.items.filter(i => (i.productId.id || i.productId._id) !== productId) };
  } else {
    localCart = { items: localCart.items.map(i =>
      (i.productId.id || i.productId._id) === productId ? { ...i, quantity } : i
    )};
  }
  return { ...localCart };
}

function localRemoveItem(productId) {
  localCart = { items: localCart.items.filter(i => (i.productId.id || i.productId._id) !== productId) };
  return { ...localCart };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCart(res.data.data || { items: [] });
      setOffline(false);
    } catch {
      setCart(localCart);
      setOffline(true);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      if (offline) throw new Error('offline');
      const res = await addToCartApi(productId, quantity);
      setCart(res.data.data);
      return true;
    } catch {
      // Try local fallback (mock product)
      const product = MOCK_PRODUCTS.find(p => p.id === productId || p._id === productId);
      if (product) {
        const updated = localAddToCart(product, quantity);
        setCart(updated);
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      if (offline) throw new Error('offline');
      const res = await updateCartItemApi(productId, quantity);
      setCart(res.data.data);
    } catch {
      setCart(localUpdateQty(productId, quantity));
    }
  };

  const removeItem = async (productId) => {
    try {
      if (offline) throw new Error('offline');
      const res = await removeFromCartApi(productId);
      setCart(res.data.data);
    } catch {
      setCart(localRemoveItem(productId));
    }
  };

  const clearCart = async () => {
    try {
      if (!offline) await clearCartApi();
    } catch {}
    localCart = { items: [] };
    setCart({ items: [] });
  };

  const cartCount = (cart.items || []).reduce((s, i) => s + i.quantity, 0);
  const cartTotal = (cart.items || []).reduce(
    (s, i) => s + (i.productId?.price || 0) * i.quantity, 0
  );

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, loading, offline, addToCart, updateQty, removeItem, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
