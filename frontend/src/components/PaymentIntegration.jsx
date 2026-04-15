import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function PaymentIntegration({ amount, orderId, customerName, customerEmail, orderDetails }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || !orderId) {
      toast.error('Amount or Order ID is missing');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => initializePayment();
      document.body.appendChild(script);
    } catch (error) {
      toast.error('Failed to load payment gateway');
      setLoading(false);
    }
  };

  const initializePayment = () => {
    const options = {
      key: 'rzp_test_1DP5MMOk78XrPO', // Demo key - Replace with your actual key
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Amazon Clone',
      description: `Order #${orderId}`,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
      order_id: orderId,
      handler: handlePaymentSuccess,
      prefill: {
        name: customerName || 'Customer',
        email: customerEmail || 'customer@example.com',
        contact: '9999999999',
      },
      notes: {
        orderId: orderId,
        items: JSON.stringify(orderDetails || []),
      },
      theme: {
        color: '#febd69',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePaymentSuccess = (response) => {
    toast.success('Payment successful! 🎉');
    console.log('Payment Response:', response);

    // Store payment details
    localStorage.setItem(
      `payment_${response.razorpay_payment_id}`,
      JSON.stringify({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        timestamp: new Date(),
        amount: amount,
      })
    );

    // Redirect to success page
    setTimeout(() => {
      window.location.href = `/order-confirmation?orderId=${orderId}&paymentId=${response.razorpay_payment_id}`;
    }, 1500);
  };

  return (
    <div className="payment-integration">
      <div className="payment-card">
        <h3>Complete Your Payment</h3>
        
        <div className="payment-details">
          <div className="detail-row">
            <span>Order Amount:</span>
            <strong>₹{amount?.toLocaleString()}</strong>
          </div>
          <div className="detail-row">
            <span>Order ID:</span>
            <strong>{orderId}</strong>
          </div>
          {customerName && (
            <div className="detail-row">
              <span>Name:</span>
              <strong>{customerName}</strong>
            </div>
          )}
        </div>

        <div className="payment-methods">
          <h4>Payment Methods Available:</h4>
          <div className="method-list">
            <div className="method-item">
              <input type="radio" id="card" name="method" defaultChecked />
              <label htmlFor="card">Credit/Debit Card</label>
            </div>
            <div className="method-item">
              <input type="radio" id="upi" name="method" />
              <label htmlFor="upi">UPI (Google Pay, PhonePe)</label>
            </div>
            <div className="method-item">
              <input type="radio" id="netbanking" name="method" />
              <label htmlFor="netbanking">Net Banking</label>
            </div>
            <div className="method-item">
              <input type="radio" id="wallet" name="method" />
              <label htmlFor="wallet">Digital Wallet</label>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePayment} 
          className="btn-pay"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ₹${amount?.toLocaleString()}`}
        </button>

        <div className="payment-security">
          <p>🔒 Your payment is 100% secure with SSL encryption</p>
          <p>✓ Trusted by millions • ✓ Money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}
