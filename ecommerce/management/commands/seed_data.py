import os
import shutil
import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from ecommerce.models import Category, Product
from django.conf import settings


class Command(BaseCommand):
    help = 'Seeds the database with Kenyan product data and randomly assigns available images'

    def add_arguments(self, parser):
        parser.add_argument(
            '--images-path',
            type=str,
            default=r'D:\BACKUP\Complete Projects\mkuru_shop\static\images',
            help='Path to the images directory'
        )

    def get_available_images(self, images_path):
        """Get list of all image files in the directory"""
        if not os.path.exists(images_path):
            return []
        
        # Supported image extensions
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
        
        # Get all image files
        images = []
        for filename in os.listdir(images_path):
            if os.path.isfile(os.path.join(images_path, filename)):
                ext = os.path.splitext(filename)[1].lower()
                if ext in image_extensions:
                    images.append(filename)
        
        return images

    def handle(self, *args, **options):
        images_source_path = options['images_path']
        
        self.stdout.write(self.style.WARNING('Starting database seeding...'))
        
        # Get available images
        available_images = self.get_available_images(images_source_path)
        
        if available_images:
            self.stdout.write(self.style.SUCCESS(f'Found {len(available_images)} images in directory'))
            self.stdout.write(f'Images: {", ".join(available_images[:5])}{"..." if len(available_images) > 5 else ""}')
        else:
            self.stdout.write(self.style.WARNING(f'⚠ No images found in: {images_source_path}'))
            self.stdout.write(self.style.WARNING('Products will be created without images'))
        
        # Create superuser if doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@mkurushop.com',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('✓ Created superuser (username: admin, password: admin123)'))
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        # Create categories
        categories_data = [
            {
                'name': 'Electronics',
                'description': 'Latest smartphones, laptops, tablets and electronic gadgets available in Kenya'
            },
            {
                'name': 'Fashion & Clothing',
                'description': 'Trendy clothes, shoes, and accessories for men, women, and children'
            },
            {
                'name': 'Home & Kitchen',
                'description': 'Home appliances, kitchen equipment, and household essentials'
            },
            {
                'name': 'Sports & Fitness',
                'description': 'Sports equipment, fitness gear, and outdoor activities essentials'
            },
            {
                'name': 'Books & Stationery',
                'description': 'Books, office supplies, and educational materials'
            },
            {
                'name': 'Health & Beauty',
                'description': 'Personal care products, cosmetics, and health supplements'
            },
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category.objects.create(**cat_data)
            categories[category.name] = category
            self.stdout.write(self.style.SUCCESS(f'✓ Created category: {category.name}'))
        
        # Kenyan products data (without specific image names)
        products_data = [
            # Electronics
            {
                'name': 'Samsung Galaxy A54 5G',
                'description': 'Experience blazing-fast 5G connectivity with the Samsung Galaxy A54. Features a stunning 6.4" Super AMOLED display, 50MP triple camera system, and 5000mAh battery. Perfect for content creators and mobile enthusiasts in Nairobi. Comes with 8GB RAM and 256GB storage. Available in Awesome Violet and Lime colors.',
                'price': Decimal('45999.00'),
                'category': categories['Electronics'],
                'stock': 25,
            },
            {
                'name': 'HP Pavilion 15 Laptop',
                'description': 'Powerful HP Pavilion laptop ideal for students and professionals in Kenya. Intel Core i5 11th Gen processor, 8GB RAM, 512GB SSD. 15.6" Full HD display perfect for work and entertainment. Pre-installed with Windows 11 Home. Great for university students and remote workers across Nairobi, Mombasa, and Kisumu.',
                'price': Decimal('65999.00'),
                'category': categories['Electronics'],
                'stock': 15,
            },
            {
                'name': 'Tecno Camon 20 Pro',
                'description': 'Affordable yet powerful Tecno Camon 20 Pro. Popular choice in Kenya with 64MP RGBW camera, 6.67" AMOLED display, and 5000mAh battery. Features 8GB RAM (expandable to 16GB) and 256GB storage. Perfect for photography enthusiasts. Supports M-Pesa payments and local carrier networks.',
                'price': Decimal('28999.00'),
                'category': categories['Electronics'],
                'stock': 40,
            },
            {
                'name': 'Infinix Smart TV 43 Inch',
                'description': 'Transform your living room with this Infinix 43" Android Smart TV. Full HD 1080p display with built-in WiFi, Netflix, YouTube, and Showmax. Perfect for Kenyan families. Supports local channels via digital decoder. Energy-efficient design suitable for Kenyan power standards. 2 years warranty included.',
                'price': Decimal('32999.00'),
                'category': categories['Electronics'],
                'stock': 12,
            },
            {
                'name': 'JBL Flip 6 Bluetooth Speaker',
                'description': 'Portable JBL Flip 6 speaker with powerful sound. IP67 waterproof and dustproof - perfect for Nairobi outdoor events, beach trips to Diani, or camping at Mt. Kenya. 12-hour battery life, PartyBoost compatibility. Available at electronics stores in Nairobi CBD and major malls.',
                'price': Decimal('14999.00'),
                'category': categories['Electronics'],
                'stock': 30,
            },
            
            # Fashion & Clothing
            {
                'name': 'Nike Air Max 270 Sneakers',
                'description': 'Authentic Nike Air Max 270 sneakers now available in Kenya. Premium cushioning and modern design. Perfect for Nairobi\'s urban lifestyle or gym workouts. Imported quality, various sizes available (UK 6-12). Popular in Westlands, Kilimani, and Karen. Breathable mesh upper, durable rubber sole.',
                'price': Decimal('12999.00'),
                'category': categories['Fashion & Clothing'],
                'stock': 50,
            },
            {
                'name': 'Ankara Print Dress',
                'description': 'Beautiful African print Ankara dress, locally tailored in Nairobi. Vibrant colors and traditional patterns celebrating Kenyan heritage. Perfect for weddings, church services, or cultural events. Available in sizes S to XXL. Made from premium cotton fabric. Support local fashion designers and celebrate African beauty.',
                'price': Decimal('3499.00'),
                'category': categories['Fashion & Clothing'],
                'stock': 35,
            },
            {
                'name': 'Maasai Leather Sandals',
                'description': 'Handcrafted genuine leather sandals made by Maasai artisans. Traditional Kenyan craftsmanship with modern comfort. Durable, comfortable, and stylish. Perfect for Nairobi\'s climate. Each purchase supports local Maasai communities. Available in brown and black. Unisex design, sizes 38-44.',
                'price': Decimal('2999.00'),
                'category': categories['Fashion & Clothing'],
                'stock': 60,
            },
            {
                'name': 'Khanga Fabric (2-piece set)',
                'description': 'Authentic Kenyan khanga fabric set (2 pieces). Traditional East African design with Swahili sayings. Versatile use as clothing, baby carrier, home décor, or beach wrap. 100% cotton, vibrant colors that don\'t fade. Essential in every Kenyan home. Various traditional sayings and patterns available.',
                'price': Decimal('1299.00'),
                'category': categories['Fashion & Clothing'],
                'stock': 100,
            },
            {
                'name': 'Kiondo Basket Bag',
                'description': 'Handwoven sisal kiondo bag by Kenyan artisans. Perfect fusion of tradition and modern fashion. Eco-friendly, durable, and stylish. Great for shopping, beach outings, or everyday use. Each bag is unique. Supports women\'s cooperatives in rural Kenya. Available in multiple sizes and colors. Export quality.',
                'price': Decimal('1899.00'),
                'category': categories['Fashion & Clothing'],
                'stock': 45,
            },
            
            # Home & Kitchen
            {
                'name': 'Sufuria Cooking Pots Set (5pcs)',
                'description': 'High-quality aluminum sufuria set - essential in every Kenyan kitchen. Set includes 5 pieces (sizes 16-28cm). Non-stick coating, heat-resistant handles. Perfect for cooking ugali, githeri, and other Kenyan dishes. Durable and easy to clean. Popular choice for restaurants and homes across Kenya.',
                'price': Decimal('3999.00'),
                'category': categories['Home & Kitchen'],
                'stock': 50,
            },
            {
                'name': 'Ramtons Microwave Oven 20L',
                'description': 'Ramtons 20L microwave oven, trusted brand in Kenya. 700W power, 5 power levels, defrost function. Perfect for reheating food, cooking quick meals. Energy-efficient, suitable for Kenyan power standards. 1-year warranty. Available at Ramtons dealers nationwide. Compact design fits any kitchen.',
                'price': Decimal('8999.00'),
                'category': categories['Home & Kitchen'],
                'stock': 20,
            },
            {
                'name': 'Runda Blender 2L',
                'description': 'Powerful 2-liter blender by Runda, Kenyan favorite. 500W motor, stainless steel blades. Perfect for making smoothies, soups, and crushing ingredients. Durable glass jar, pulse function. Ideal for juice vendors and homes. Popular in Nairobi, Nakuru, and Eldoret. 2-year warranty included.',
                'price': Decimal('4999.00'),
                'category': categories['Home & Kitchen'],
                'stock': 35,
            },
            {
                'name': 'Mkeka Traditional Mat',
                'description': 'Handwoven mkeka mat from coastal Kenya. Traditional craftsmanship from Lamu and Mombasa. Perfect for prayers, picnics, beach outings, or home décor. Made from natural palm leaves. Eco-friendly, durable, and culturally significant. Available in various sizes. Support coastal artisan communities.',
                'price': Decimal('1499.00'),
                'category': categories['Home & Kitchen'],
                'stock': 70,
            },
            {
                'name': 'Royco Spice Rack Organizer',
                'description': 'Kitchen spice rack organizer, popular in Kenyan homes. Holds up to 16 spice jars. Perfect for organizing Royco, paprika, pilipili, and other Kenyan spices. Wall-mounted or countertop use. Made from durable plastic. Makes cooking easier. Essential for modern Kenyan kitchens. Easy to clean.',
                'price': Decimal('1299.00'),
                'category': categories['Home & Kitchen'],
                'stock': 55,
            },
            
            # Sports & Fitness
            {
                'name': 'Yoga Mat with Bag',
                'description': 'Premium yoga mat popular among Nairobi fitness enthusiasts. 6mm thick, non-slip surface, eco-friendly material. Perfect for yoga classes in Westlands, Kilimani, or home workouts. Comes with carrying bag and strap. Lightweight and portable. Join Kenya\'s growing wellness community. Available in multiple colors.',
                'price': Decimal('2499.00'),
                'category': categories['Sports & Fitness'],
                'stock': 40,
            },
            {
                'name': 'Football (Official Size 5)',
                'description': 'Official size 5 football, perfect for Kenyan football enthusiasts. Durable synthetic leather, suitable for both grass and turf. Popular in schools, estates, and football clubs across Kenya. Support the beautiful game that unites Kenya. FIFA quality standards. Includes pump needle.',
                'price': Decimal('1899.00'),
                'category': categories['Sports & Fitness'],
                'stock': 80,
            },
            {
                'name': 'Dumbbells Set (5kg pair)',
                'description': 'Cast iron dumbbells set, perfect for home workouts in Kenya. 5kg per dumbbell, vinyl coated for comfort and floor protection. Build strength without expensive gym memberships. Popular in Nairobi apartments and home gyms. Compact storage. Start your fitness journey today.',
                'price': Decimal('3499.00'),
                'category': categories['Sports & Fitness'],
                'stock': 30,
            },
            {
                'name': 'Skipping Rope with Counter',
                'description': 'Professional skipping rope with digital counter. Popular training tool in Kenyan gyms and schools. Adjustable length, comfortable handles. Great for cardio and weight loss. Used by boxers and fitness enthusiasts. Affordable fitness equipment. Build stamina like Kenyan marathon champions.',
                'price': Decimal('899.00'),
                'category': categories['Sports & Fitness'],
                'stock': 100,
            },
            {
                'name': 'Swimming Goggles & Cap Set',
                'description': 'Professional swimming goggles and cap set. Perfect for swimming pools in Nairobi, Mombasa, and other Kenyan cities. Anti-fog lenses, UV protection, adjustable straps. Suitable for adults and teens. Popular among swimming clubs and water sports enthusiasts. Includes storage case.',
                'price': Decimal('1299.00'),
                'category': categories['Sports & Fitness'],
                'stock': 45,
            },
            
            # Books & Stationery
            {
                'name': 'Ngugi wa Thiongo Book Collection',
                'description': 'Classic collection of books by Ngugi wa Thiong\'o, Kenya\'s literary giant. Includes "Weep Not, Child," "The River Between," and "A Grain of Wheat." Essential reading for understanding Kenyan history and culture. Popular in schools and universities. Support African literature. Perfect gift for book lovers.',
                'price': Decimal('2499.00'),
                'category': categories['Books & Stationery'],
                'stock': 50,
            },
            {
                'name': 'Kenya Primary Notebooks (10pcs)',
                'description': 'Quality exercise books for Kenyan schools. Set of 10 notebooks, 60 pages each. Follows 8-4-4 curriculum standards. Durable covers, smooth writing paper. Essential for primary school students across Kenya. Bulk pricing available for schools. Trusted by parents and teachers nationwide.',
                'price': Decimal('499.00'),
                'category': categories['Books & Stationery'],
                'stock': 200,
            },
            {
                'name': 'Staedtler Geometry Set',
                'description': 'Complete geometry set for Kenyan students. Includes compass, protractor, set squares, ruler, pencil, and sharpener. Essential for mathematics and technical drawing. Meets KNEC exam requirements. Popular among Form 1-4 students. Durable metal instruments. Available at schools nationwide.',
                'price': Decimal('899.00'),
                'category': categories['Books & Stationery'],
                'stock': 80,
            },
            {
                'name': 'Kenya Map Wall Chart',
                'description': 'Large educational map of Kenya showing counties, major cities, national parks, and key landmarks. Laminated, tear-resistant. Perfect for classrooms, offices, or homes. Help children learn Kenyan geography. Shows all 47 counties, major roads, lakes, and mountains. 60cm x 90cm size.',
                'price': Decimal('799.00'),
                'category': categories['Books & Stationery'],
                'stock': 60,
            },
            {
                'name': 'Bic Pen Pack (50pcs)',
                'description': 'Bulk pack of 50 Bic ballpoint pens, blue ink. Reliable writing instruments used across Kenya. Perfect for offices, schools, or businesses. Smooth writing, long-lasting. Trusted brand in Kenya for decades. Wholesale pricing for bulk orders. Essential office and school supplies.',
                'price': Decimal('999.00'),
                'category': categories['Books & Stationery'],
                'stock': 150,
            },
            
            # Health & Beauty
            {
                'name': 'Shea Butter Natural (500g)',
                'description': 'Pure organic shea butter, popular in Kenya for skin and hair care. 100% natural, unrefined. Perfect moisturizer for Kenya\'s climate. Soothes dry skin, promotes hair growth. Used in traditional African beauty routines. No chemicals or additives. Popular in Nairobi salons. Imported from West Africa.',
                'price': Decimal('1299.00'),
                'category': categories['Health & Beauty'],
                'stock': 70,
            },
            {
                'name': 'African Black Soap',
                'description': 'Authentic African black soap made with natural ingredients. Traditional recipe used for centuries. Treats acne, evens skin tone, gentle cleansing. Popular among Kenyan beauty enthusiasts. No harsh chemicals. Suitable for all skin types. Eco-friendly, biodegradable. Support natural beauty products.',
                'price': Decimal('599.00'),
                'category': categories['Health & Beauty'],
                'stock': 90,
            },
            {
                'name': 'Hair Bonnet Satin (Pack of 3)',
                'description': 'Satin hair bonnets essential for protecting African hair. Pack of 3 bonnets in assorted colors. Prevents breakage, retains moisture, maintains hairstyles. Popular among Kenyan women. Elastic band, comfortable fit. Perfect for sleeping. Preserves braids, weaves, and natural hair. Available in Nairobi beauty stores.',
                'price': Decimal('799.00'),
                'category': categories['Health & Beauty'],
                'stock': 100,
            },
            {
                'name': 'Aloe Vera Gel 250ml',
                'description': 'Pure aloe vera gel, 99% natural. Multi-purpose product popular in Kenya. Soothes sunburn, moisturizes skin, treats minor burns. Perfect for Kenya\'s sunny climate. Used in beauty routines and first aid. No parabens or artificial colors. Locally available across pharmacies. Dermatologist recommended.',
                'price': Decimal('899.00'),
                'category': categories['Health & Beauty'],
                'stock': 80,
            },
            {
                'name': 'Essential Oils Set (6 bottles)',
                'description': 'Aromatherapy essential oils set gaining popularity in Nairobi. Includes lavender, eucalyptus, tea tree, peppermint, lemon, and orange oils. Each 10ml. Use for relaxation, massage, or diffusers. Natural wellness products. Popular in spas and homes. Therapeutic grade. Instructions included.',
                'price': Decimal('2499.00'),
                'category': categories['Health & Beauty'],
                'stock': 40,
            },
        ]
        
        # Ensure media directory exists
        media_root = settings.MEDIA_ROOT
        products_media_path = os.path.join(media_root, 'products')
        os.makedirs(products_media_path, exist_ok=True)
        
        # Shuffle images for random assignment
        if available_images:
            random.shuffle(available_images)
        
        # Create products and assign random images
        products_created = 0
        image_index = 0
        
        for product_data in products_data:
            # Assign random image if available
            if available_images:
                # Use modulo to cycle through images if we have fewer images than products
                image_name = available_images[image_index % len(available_images)]
                image_index += 1
                
                source_image = os.path.join(images_source_path, image_name)
                dest_image = os.path.join(products_media_path, image_name)
                
                try:
                    # Copy image if not already copied
                    if not os.path.exists(dest_image):
                        shutil.copy2(source_image, dest_image)
                        self.stdout.write(f'  ✓ Copied image: {image_name}')
                    
                    product_data['image'] = f'products/{image_name}'
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'  ⚠ Could not copy {image_name}: {str(e)}'))
            
            product = Product.objects.create(**product_data)
            products_created += 1
            
            image_status = f'with image: {image_name}' if 'image' in product_data else 'without image'
            self.stdout.write(self.style.SUCCESS(f'✓ Created product: {product.name} ({image_status}) - KES {product.price}'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('DATABASE SEEDING COMPLETED!'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS(f'✓ Categories created: {len(categories_data)}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Products created: {products_created}'))
        
        if available_images:
            self.stdout.write(self.style.SUCCESS(f'✓ Images found: {len(available_images)}'))
            self.stdout.write(self.style.SUCCESS(f'✓ Images assigned randomly to products'))
        else:
            self.stdout.write(self.style.WARNING('⚠ No images found - products created without images'))
            self.stdout.write(self.style.WARNING(f'   Add images to: {images_source_path}'))
            self.stdout.write(self.style.WARNING('   Then run: python manage.py seed_data'))
        
        self.stdout.write(self.style.SUCCESS('\nYou can now:'))
        self.stdout.write('  1. Visit http://localhost:8000/admin to manage products')
        self.stdout.write('  2. Login with username: admin, password: admin123')
        self.stdout.write('  3. Start the React frontend to browse products')
        self.stdout.write(self.style.SUCCESS('\nHappy shopping! 🛒'))