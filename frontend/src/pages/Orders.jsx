import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import '../Orders.css'; // Import the CSS file

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

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
      setCancellingId(orderId);
      try {
        await ordersAPI.cancel(orderId);
        await fetchOrders();
        // Show success message
        alert('Order cancelled successfully');
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to cancel order');
      } finally {
        setCancellingId(null);
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
    };
    return icons[status] || '📦';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-login">
        <div className="login-prompt">
          <div className="prompt-icon">
            <i className="fas fa-box-open"></i>
          </div>
          <h2>Please login to view your orders</h2>
          <p>You need to be logged in to access your order history</p>
          <Link to="/login" className="btn-login">
            <i className="fas fa-sign-in-alt"></i>
            Login
          </Link>
          <p className="register-prompt">
            Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-box-open"></i>
          </div>
          <h2>You have no orders yet</h2>
          <p>Looks like you haven't placed any orders. Start shopping to see your orders here.</p>
          <Link to="/products" className="btn-primary">
            <i className="fas fa-shopping-bag"></i>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span className="separator">›</span>
        <span className="current">My Orders</span>
      </div>

      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1>My Orders</h1>
          <p className="orders-count">You have {orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>
        <Link to="/products" className="btn-shop">
          <i className="fas fa-plus"></i>
          Shop More
        </Link>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            {/* Order Header */}
            <div className="order-header">
              <div className="order-header-left">
                <div className="order-id">
                  <span className="id-label">Order</span>
                  <span className="id-value">#{order.id}</span>
                </div>
                <div className="order-date">
                  <i className="far fa-calendar-alt"></i>
                  {formatDate(order.created_at)}
                </div>
              </div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                <span className="status-icon">{getStatusIcon(order.status)}</span>
                <span className="status-text">{order.status}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <div className="item-image">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} />
                      ) : (
                        <i className="fas fa-box"></i>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.product_name}</h4>
                      <p className="item-meta">
                        <span>Qty: {item.quantity}</span>
                        <span className="item-price">{formatPrice(item.price)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="item-subtotal">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="order-footer">
              <div className="order-summary">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{order.items?.length || 0}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="shipping-free">Free</span>
                </div>
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span className="total-amount">{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              <div className="order-actions">
                <Link to={`/orders/${order.id}`} className="btn-view">
                  <i className="fas fa-eye"></i>
                  View Details
                </Link>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="btn-cancel"
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? (
                      <>
                        <span className="spinner-small"></span>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times"></i>
                        Cancel Order
                      </>
                    )}
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button className="btn-reorder">
                    <i className="fas fa-redo-alt"></i>
                    Reorder
                  </button>
                )}
              </div>
            </div>

            {/* Tracking Info for Shipped Orders */}
            {order.status === 'shipped' && order.tracking_number && (
              <div className="tracking-info">
                <i className="fas fa-truck"></i>
                <div className="tracking-details">
                  <span className="tracking-label">Tracking Number:</span>
                  <span className="tracking-number">{order.tracking_number}</span>
                </div>
                <button className="btn-track">Track Package</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Statistics */}
      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {orders.filter(o => o.status === 'delivered').length}
            </span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
            </span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {formatPrice(orders.reduce((sum, order) => sum + order.total_amount, 0))}
            </span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;