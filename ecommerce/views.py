from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.contrib.auth.models import User
from .models import Category, Product, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, OrderSerializer,
    OrderItemSerializer, CreateOrderSerializer, UserSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category model
    GET /api/categories/ - List all categories
    POST /api/categories/ - Create category (admin only)
    GET /api/categories/{id}/ - Retrieve category
    PUT/PATCH /api/categories/{id}/ - Update category (admin only)
    DELETE /api/categories/{id}/ - Delete category (admin only)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get all products in a category"""
        category = self.get_object()
        products = category.products.filter(is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product model
    GET /api/products/ - List all products
    POST /api/products/ - Create product (admin only)
    GET /api/products/{id}/ - Retrieve product
    PUT/PATCH /api/products/{id}/ - Update product (admin only)
    DELETE /api/products/{id}/ - Delete product (admin only)
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category', None)
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        return queryset 
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products (newest 8 products)"""
        featured_products = self.get_queryset()[:8]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products by name or description"""
        query = request.query_params.get('q', '')
        if query:
            products = self.get_queryset().filter(
                name__icontains=query
            ) | self.get_queryset().filter(
                description__icontains=query
            )
        else:
            products = self.get_queryset()
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order model
    GET /api/orders/ - List user's orders
    POST /api/orders/ - Create new order
    GET /api/orders/{id}/ - Retrieve order
    PATCH /api/orders/{id}/ - Update order status (admin only)
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new order"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Return order with full details
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        """Cancel an order (user can only cancel their own pending orders)"""
        order = self.get_object()
        
        if order.status != 'pending':
            return Response(
                {'error': 'Only pending orders can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if order.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You can only cancel your own orders'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Restore stock
        for item in order.items.all():
            item.product.stock += item.quantity
            item.product.save()
        
        order.status = 'cancelled'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        orders = Order.objects.filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for User model (read-only for current user)
    GET /api/users/me/ - Get current user info
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)