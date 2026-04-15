import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';

export const RealtimeContext = createContext();

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}

export function RealtimeProvider({ children }) {
  const [stockUpdates, setStockUpdates] = useState({});
  const [cartUpdates, setCartUpdates] = useState({});
  const [orderUpdates, setOrderUpdates] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Simulate real-time stock updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random product stock updates (simulate real-time)
      const productIds = ['mock-1', 'mock-2', 'mock-3', 'mock-4', 'mock-5'];
      const randomProduct = productIds[Math.floor(Math.random() * productIds.length)];
      const newStock = Math.floor(Math.random() * 100) + 1;

      setStockUpdates(prev => ({
        ...prev,
        [randomProduct]: {
          stock: newStock,
          updated: new Date(),
          status: newStock < 10 ? 'low' : 'available'
        }
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate order status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random order status updates
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.forEach((order, index) => {
        const statuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        const currentIndex = statuses.indexOf(order.status);
        
        if (currentIndex < statuses.length - 1 && Math.random() > 0.7) {
          const newStatus = statuses[currentIndex + 1];
          setOrderUpdates(prev => ({
            ...prev,
            [order.orderId]: {
              status: newStatus,
              updated: new Date(),
              message: `Your order ${order.orderId} has been ${newStatus.toLowerCase()}`
            }
          }));

          // Add notification
          addNotification({
            type: 'order',
            title: 'Order Update',
            message: `Your order has been ${newStatus.toLowerCase()}! 📦`,
            orderId: order.orderId
          });
        }
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [
      {
        id,
        timestamp: new Date(),
        ...notification
      },
      ...prev
    ]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateCartLive = useCallback((productId, quantity) => {
    setCartUpdates(prev => ({
      ...prev,
      [productId]: {
        quantity,
        updated: new Date()
      }
    }));

    addNotification({
      type: 'cart',
      title: 'Cart Updated',
      message: `Cart updated with ${quantity} item(s) 🛒`
    });
  }, [addNotification]);

  const updateStockLive = useCallback((productId, stock) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: {
        stock,
        updated: new Date(),
        status: stock < 10 ? 'low' : 'available'
      }
    }));

    if (stock < 10) {
      addNotification({
        type: 'stock',
        title: 'Low Stock Alert',
        message: `Only ${stock} items left in stock! ⚠️`,
        productId
      });
    }
  }, [addNotification]);

  const getStockStatus = useCallback((productId) => {
    return stockUpdates[productId] || null;
  }, [stockUpdates]);

  const getOrderStatus = useCallback((orderId) => {
    return orderUpdates[orderId] || null;
  }, [orderUpdates]);

  return (
    <RealtimeContext.Provider value={{
      stockUpdates,
      cartUpdates,
      orderUpdates,
      notifications,
      addNotification,
      removeNotification,
      updateCartLive,
      updateStockLive,
      getStockStatus,
      getOrderStatus
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}
