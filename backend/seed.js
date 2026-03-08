import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Banner from './models/Banner.js';
import Coupon from './models/Coupon.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/catchy-shop');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([Product.deleteMany({}), Category.deleteMany({}), Banner.deleteMany({}), Coupon.deleteMany({}), User.deleteMany({ role: 'admin' })]);

    // Create admin user
    await User.create({ name: 'Admin', email: 'admin@catchyshop.com', phone: '9999999999', password: 'admin123', role: 'admin', gender: 'other' });
    console.log('✅ Admin created: admin@catchyshop.com / admin123');

    // Create categories
    const cats = await Category.insertMany([
      { name: 'T-Shirts', slug: 't-shirts', gender: 'men', order: 1 },
      { name: 'Shirts', slug: 'shirts', gender: 'men', order: 2 },
      { name: 'Jeans', slug: 'jeans', gender: 'men', order: 3 },
      { name: 'Jackets', slug: 'jackets', gender: 'men', order: 4 },
      { name: 'Dresses', slug: 'dresses', gender: 'women', order: 5 },
      { name: 'Tops', slug: 'tops', gender: 'women', order: 6 },
      { name: 'Kurtas', slug: 'kurtas', gender: 'women', order: 7 },
      { name: 'Skirts', slug: 'skirts', gender: 'women', order: 8 },
      { name: 'Sneakers', slug: 'sneakers', gender: 'unisex', order: 9 },
      { name: 'Watches', slug: 'watches', gender: 'unisex', order: 10 }
    ]);
    console.log('✅ Categories created');

    // Create products
    const brands = ['Nike', 'Puma', 'H&M', 'Zara', 'Levis', 'Adidas', 'Allen Solly', 'Tommy Hilfiger', 'USPA', 'Roadster'];
    const fabrics = ['Cotton', 'Polyester', 'Silk', 'Denim', 'Linen', 'Rayon'];
    const fits = ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Skinny Fit'];
    const colors = [
      { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Red', hex: '#E53935' }, { name: 'Blue', hex: '#2196F3' }, { name: 'Green', hex: '#43A047' },
      { name: 'Pink', hex: '#EC407A' }, { name: 'Grey', hex: '#9E9E9E' }, { name: 'Beige', hex: '#D4C5A9' },
      { name: 'Maroon', hex: '#880E4F' }
    ];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const productImages = [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=480',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=480',
      'https://images.unsplash.com/photo-1434389677669-e08b4cda3a97?w=480',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=480',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=480',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=480',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=480',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=480',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=480',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=480'
    ];
    const womenImages = [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=480',
      'https://images.unsplash.com/photo-1502716119720-b23a1e3b3c42?w=480',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=480',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=480',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=480',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=480',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=480'
    ];

    const productNames = {
      'T-Shirts': ['Classic Crew Neck', 'Graphic Print Tee', 'Striped Polo', 'V-Neck Essential', 'Oversized Urban Tee', 'Henley Full Sleeves'],
      'Shirts': ['Oxford Button Down', 'Slim Fit Formal', 'Casual Check Shirt', 'Linen Summer Shirt', 'Denim Wash Shirt'],
      'Jeans': ['Slim Fit Stretch', 'Classic Straight Leg', 'Ripped Skinny Jeans', 'Relaxed Cargo Jeans', 'Tapered Ankle Length'],
      'Jackets': ['Bomber Jacket', 'Denim Classic Jacket', 'Windbreaker Sport', 'Puffer Winter Jacket', 'Leather Biker Jacket'],
      'Dresses': ['Floral Maxi Dress', 'Bodycon Party Dress', 'A-Line Casual Dress', 'Wrap Midi Dress', 'Shirt Dress Striped'],
      'Tops': ['Crop Top Basics', 'Ruffled Blouse', 'Peasant Top Embroidered', 'Peplum Formal Top', 'Off-Shoulder Knit'],
      'Kurtas': ['Anarkali Embroidered', 'Straight Cut Cotton', 'A-Line Printed Kurta', 'Palazzo Set Designer', 'Sharara Suit Festive'],
      'Skirts': ['Pleated Midi Skirt', 'Denim Mini Skirt', 'Maxi Wrap Skirt', 'A-Line Flared Skirt', 'Pencil Skirt Formal'],
      'Sneakers': ['Classic White Sneakers', 'Running Performance', 'High-Top Basketball', 'Slip-On Casual', 'Retro Vintage Runner'],
      'Watches': ['Chronograph Steel', 'Digital Sport Watch', 'Analog Classic Gold', 'Smart Fitness Tracker', 'Minimalist Leather']
    };

    const products = [];
    Object.keys(productNames).forEach((catName) => {
      const cat = cats.find(c => c.name === catName);
      const gender = cat.gender === 'unisex' ? (Math.random() > 0.5 ? 'men' : 'women') : cat.gender;
      const imgSet = gender === 'women' ? womenImages : productImages;

      productNames[catName].forEach((name, idx) => {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const mrp = Math.round((Math.random() * 4000 + 500) / 100) * 100;
        const discountPct = [10, 15, 20, 25, 30, 35, 40, 50][Math.floor(Math.random() * 8)];
        const price = Math.round(mrp * (1 - discountPct / 100));
        const productColors = colors.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 2);
        const img1 = imgSet[(idx * 2) % imgSet.length];
        const img2 = imgSet[(idx * 2 + 1) % imgSet.length];

        products.push({
          title: `${brand} ${name}`,
          brand, category: catName, subCategory: catName.toLowerCase(),
          description: `Premium quality ${name.toLowerCase()} from ${brand}. Made with the finest ${fabrics[idx % fabrics.length].toLowerCase()} for ultimate comfort and style. Perfect for ${['casual outings', 'formal events', 'everyday wear', 'special occasions', 'active lifestyle'][idx % 5]}.`,
          shortDescription: `${brand} ${name} - ${fabrics[idx % fabrics.length]}, ${fits[idx % fits.length]}`,
          images: [img1, img2],
          mrp, price, discount: discountPct,
          sizes: sizes.map(s => ({ size: s, stock: Math.floor(Math.random() * 30) + 5 })),
          colors: productColors.map(c => ({ ...c, images: [img1] })),
          fabric: fabrics[idx % fabrics.length],
          fit: fits[idx % fits.length],
          occasion: ['Casual', 'Party', 'Formal', 'Sports', 'Ethnic'].sort(() => Math.random() - 0.5).slice(0, 2),
          washCare: 'Machine wash cold. Do not bleach. Tumble dry low. Iron on low heat.',
          gender: cat.gender === 'unisex' ? 'unisex' : cat.gender,
          tags: [catName.toLowerCase(), brand.toLowerCase(), gender, fabrics[idx % fabrics.length].toLowerCase()],
          avgRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          numReviews: Math.floor(Math.random() * 500) + 10,
          isFeatured: Math.random() > 0.6,
          isNewArrival: Math.random() > 0.5,
          reviews: Array.from({ length: 3 }, (_, i) => ({
            user: new mongoose.Types.ObjectId(),
            rating: Math.floor(Math.random() * 3) + 3,
            title: ['Great product!', 'Love it!', 'Good value', 'Nice quality', 'Fits perfectly'][i % 5],
            comment: ['Excellent quality and fit. Highly recommend!', 'Very comfortable and stylish. Worth the price.', 'Good product but delivery was slow. Overall satisfied.'][i % 3],
            helpfulVotes: Math.floor(Math.random() * 50),
            verified: true
          }))
        });
      });
    });

    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products created`);

    // Create banners
    await Banner.insertMany([
      { title: 'Summer Sale', subtitle: 'Up to 60% OFF on trending styles', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200', link: '/category/t-shirts', ctaText: 'Shop Now', position: 1 },
      { title: 'New Collection', subtitle: 'Fresh arrivals handpicked for you', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200', link: '/category/dresses', ctaText: 'Explore', position: 2 },
      { title: 'Ethnic Wear', subtitle: 'Festive collection starting ₹999', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200', link: '/category/kurtas', ctaText: 'Shop Ethnic', position: 3 },
      { title: 'Sports Edit', subtitle: 'Activewear for every workout', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200', link: '/category/sneakers', ctaText: 'Get Moving', position: 4 }
    ]);
    console.log('✅ Banners created');

    // Create coupons
    await Coupon.insertMany([
      { code: 'WELCOME10', description: '10% off on first order', type: 'percentage', value: 10, minOrderAmount: 499, maxDiscount: 200, expiresAt: new Date('2027-12-31') },
      { code: 'FLAT200', description: 'Flat ₹200 off on orders above ₹999', type: 'flat', value: 200, minOrderAmount: 999, expiresAt: new Date('2027-12-31') },
      { code: 'MEGA30', description: '30% off on orders above ₹1999', type: 'percentage', value: 30, minOrderAmount: 1999, maxDiscount: 800, expiresAt: new Date('2027-12-31') },
      { code: 'SUPER500', description: 'Flat ₹500 off on orders above ₹2499', type: 'flat', value: 500, minOrderAmount: 2499, expiresAt: new Date('2027-12-31') }
    ]);
    console.log('✅ Coupons created');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
