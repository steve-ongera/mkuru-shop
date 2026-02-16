import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await ordersAPI.cancel(orderId);
        fetchOrders();
        alert('Order cancelled successfully');
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to cancel order');
      }
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return statusClasses[status] || '';
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-login">
        <h2>Please login to view your orders</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>You have no orders yet</h2>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <p>
                <strong>Date:</strong>{' '}
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ${order.total_amount}
              </p>
              <p>
                <strong>Items:</strong> {order.items?.length || 0}
              </p>
            </div>

            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <span>${item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="order-actions">
              <Link to={`/orders/${order.id}`} className="btn btn-secondary">
                View Details
              </Link>
              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="btn btn-danger"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;