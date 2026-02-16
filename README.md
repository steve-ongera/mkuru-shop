# Mkuru Shop - E-commerce Platform

A full-stack e-commerce application built with Django REST Framework (backend) and React (frontend).

## 📁 Project Structure

```
mkuru-shop/
├── mkuru-shop-backend/          # Django Backend
│   ├── mkuru_shop/              # Main project directory
│   │   ├── __init__.py
│   │   ├── settings.py          # Project settings
│   │   ├── urls.py              # Main URL configuration
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── ecommerce/               # E-commerce app
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py            # Database models (Category, Product, Order, OrderItem)
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views.py             # ViewSets for API endpoints
│   │   ├── urls.py              # App URL configuration
│   │   ├── admin.py             # Django admin configuration
│   │   └── migrations/          # Database migrations
│   ├── media/                   # User uploaded files
│   ├── staticfiles/             # Collected static files
│   ├── manage.py                # Django management script
│   ├── requirements.txt         # Python dependencies
│   └── .gitignore
│
└── mkuru-shop-frontend/         # React Frontend
    ├── public/                  # Public assets
    ├── src/
    │   ├── components/          # React components
    │   │   ├── Header.jsx       # Navigation header
    │   │   ├── Footer.jsx       # Footer component
    │   │   └── ProductCard.jsx  # Product card component
    │   ├── pages/               # Page components
    │   │   ├── Home.jsx         # Home page
    │   │   ├── Products.jsx     # Products listing
    │   │   ├── ProductDetail.jsx # Product details
    │   │   ├── Cart.jsx         # Shopping cart
    │   │   ├── Checkout.jsx     # Checkout page
    │   │   ├── Orders.jsx       # Order history
    │   │   └── Login.jsx        # Login page
    │   ├── context/             # React Context
    │   │   ├── AuthContext.jsx  # Authentication state
    │   │   └── CartContext.jsx  # Shopping cart state
    │   ├── services/            # API services
    │   │   └── api.js           # Axios API configuration
    │   ├── App.jsx              # Main App component
    │   ├── App.css              # Application styles
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── index.html               # HTML template
    ├── package.json             # Node dependencies
    ├── vite.config.js           # Vite configuration
    └── .gitignore
```

## 🚀 Features

### Backend (Django)
- ✅ RESTful API with Django REST Framework
- ✅ JWT Authentication
- ✅ 4 Core Models: Category, Product, Order, OrderItem
- ✅ CRUD operations for all models
- ✅ Product filtering and search
- ✅ Order management system
- ✅ Admin panel for management
- ✅ CORS configuration for React frontend

### Frontend (React)
- ✅ Modern React with Hooks
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Product browsing and filtering
- ✅ Order placement and tracking
- ✅ Responsive design

## 🛠️ Technology Stack

### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework** - API development
- **djangorestframework-simplejwt** - JWT authentication
- **django-cors-headers** - CORS handling
- **Pillow** - Image processing
- **SQLite** - Database (default)

### Frontend
- **React 18** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd mkuru-shop-backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Run development server:**
```bash
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd mkuru-shop-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category (admin)
- `GET /api/categories/{id}/` - Retrieve category
- `PUT/PATCH /api/categories/{id}/` - Update category (admin)
- `DELETE /api/categories/{id}/` - Delete category (admin)
- `GET /api/categories/{id}/products/` - Get products in category

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create product (admin)
- `GET /api/products/{id}/` - Retrieve product
- `PUT/PATCH /api/products/{id}/` - Update product (admin)
- `DELETE /api/products/{id}/` - Delete product (admin)
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/search/?q={query}` - Search products

### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Retrieve order
- `PATCH /api/orders/{id}/cancel/` - Cancel order
- `GET /api/orders/my_orders/` - Get current user's orders

### Users
- `GET /api/users/me/` - Get current user info

## 🎯 Usage Guide

### Admin Panel
1. Access Django admin at `http://localhost:8000/admin`
2. Login with superuser credentials
3. Add categories and products

### Frontend Usage
1. Browse products on home page
2. Filter products by category
3. Search for specific products
4. Add items to cart
5. Login to place orders
6. View order history

## 📝 Models Overview

### Category
- `name` - Category name (unique)
- `description` - Category description
- `created_at` - Creation timestamp

### Product
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `category` - Foreign key to Category
- `stock` - Available quantity
- `image` - Product image
- `is_active` - Product visibility
- `created_at` / `updated_at` - Timestamps

### Order
- `user` - Foreign key to User
- `status` - Order status (pending, processing, shipped, delivered, cancelled)
- `total_amount` - Order total
- `shipping_address` - Delivery address
- `phone_number` - Contact number
- `created_at` / `updated_at` - Timestamps

### OrderItem
- `order` - Foreign key to Order
- `product` - Foreign key to Product
- `quantity` - Item quantity
- `price` - Price at time of order

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Access tokens expire in 60 minutes
- Refresh tokens expire in 7 days
- Tokens are stored in localStorage
- Automatic token refresh on expiration

## 🌐 Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

## 🚧 Development Tips

### Adding Sample Data
Use Django admin to add:
1. Categories (e.g., Electronics, Clothing, Books)
2. Products with images and descriptions
3. Test orders

### Testing API
Use tools like:
- Postman
- Thunder Client (VS Code extension)
- Django REST Framework browsable API (`http://localhost:8000/api/`)

## 📈 Future Enhancements

- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] User profile management
- [ ] Order tracking
- [ ] Product recommendations
- [ ] Multi-image support
- [ ] Inventory management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ for learning Django and React

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check existing documentation
- Review Django and React official docs

---

Happy Coding! 🚀