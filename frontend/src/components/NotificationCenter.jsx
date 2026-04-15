import React, { useContext } from 'react';
import { RealtimeContext } from '../context/RealtimeContext';
import { FiX, FiAlertCircle, FiCheckCircle, FiShoppingCart } from 'react-icons/fi';

export default function NotificationCenter() {
  const { notifications, removeNotification } = useContext(RealtimeContext);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiCheckCircle className="notification-icon success" />;
      case 'stock':
        return <FiAlertCircle className="notification-icon warning" />;
      case 'cart':
        return <FiShoppingCart className="notification-icon info" />;
      default:
        return <FiCheckCircle className="notification-icon" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
      case 'order':
        return '#007600';
      case 'warning':
      case 'stock':
        return '#ff9900';
      case 'info':
      case 'cart':
        return '#0066c0';
      default:
        return '#0f1111';
    }
  };

  return (
    <div className="notification-center">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          style={{ borderLeftColor: getNotificationColor(notification.type) }}
        >
          <div className="notification-content">
            <div className="notification-header">
              {getNotificationIcon(notification.type)}
              <h4>{notification.title}</h4>
            </div>
            <p className="notification-message">{notification.message}</p>
            <span className="notification-time">
              {notification.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
