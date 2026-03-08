import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const adjectives = ['Premium', 'Luxury', 'Essential', 'Classic', 'Modern', 'Urban', 'Vintage', 'Signature', 'Authentic', 'Casual', 'Formal', 'Sporty', 'Everyday', 'Exclusive'];

const seed1000 = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/catchy-shop');
    console.log('Connected to MongoDB');

    let cats = await Category.find({});
    if (cats.length === 0) {
      console.log('No categories found. Adding defaults...');
      cats = await Category.insertMany([
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
    }

    const brands = ['Nike', 'Puma', 'H&M', 'Zara', 'Levis', 'Adidas', 'Allen Solly', 'Tommy Hilfiger', 'USPA', 'Roadster', 'Jack & Jones', 'Under Armour', 'Calvin Klein', 'Wrangler', 'Lee', 'Pepe Jeans'];
    const fabrics = ['Cotton', 'Polyester', 'Silk', 'Denim', 'Linen', 'Rayon', 'Blend', 'Wool', 'Viscose'];
    const fits = ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Skinny Fit', 'Loose Fit', 'Tailored Fit'];
    const colors = [
      { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Red', hex: '#E53935' }, { name: 'Blue', hex: '#2196F3' }, { name: 'Green', hex: '#43A047' },
      { name: 'Pink', hex: '#EC407A' }, { name: 'Grey', hex: '#9E9E9E' }, { name: 'Beige', hex: '#D4C5A9' },
      { name: 'Maroon', hex: '#880E4F' }, { name: 'Yellow', hex: '#FFEB3B' }, { name: 'Teal', hex: '#009688' },
      { name: 'Purple', hex: '#9C27B0' }, { name: 'Olive', hex: '#808000' }
    ];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const menUnisexImages = [
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
      'T-Shirts': ['Crew Neck', 'Polo', 'V-Neck', 'Oversized Tee', 'Henley', 'Graphic Tee', 'Pocket Tee', 'Long Sleeve Tee'],
      'Shirts': ['Button Down', 'Formal Shirt', 'Check Shirt', 'Summer Shirt', 'Denim Shirt', 'Flannel Shirt', 'Cuban Collar'],
      'Jeans': ['Slim Fit', 'Straight', 'Skinny', 'Cargo', 'Bootcut', 'Tapered', 'Distressed'],
      'Jackets': ['Bomber', 'Denim', 'Windbreaker', 'Puffer', 'Biker', 'Varsity', 'Fleece', 'Quilted'],
      'Dresses': ['Maxi Dress', 'Bodycon', 'A-Line', 'Wrap Dress', 'Shirt Dress', 'Slip Dress', 'Shift Dress'],
      'Tops': ['Crop Top', 'Blouse', 'Peasant Top', 'Peplum', 'Off-Shoulder', 'Halter Top', 'Camisole'],
      'Kurtas': ['Anarkali', 'Straight Cut', 'A-Line', 'Palazzo Set', 'Sharara Suit', 'Short Kurti', 'Kaftan'],
      'Skirts': ['Pleated Skirt', 'Mini Skirt', 'Maxi Skirt', 'Flared Skirt', 'Pencil Skirt', 'A-Line Skirt'],
      'Sneakers': ['White Sneakers', 'Running', 'Basketball', 'Slip-On', 'Vintage', 'Chunky', 'Canvas'],
      'Watches': ['Chronograph', 'Digital', 'Analog', 'Smart Watch', 'Minimalist', 'Diver', 'Dress Watch']
    };

    console.log('Generating 1100 products...');
    const products = [];
    
    // We clear all existing products so we have a clean slate of 1100
    await Product.deleteMany({});
    console.log('Cleared old products');

    for (let i = 0; i < 1100; i++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const catName = cat.name;
      const gender = cat.gender === 'unisex' ? (Math.random() > 0.5 ? 'men' : 'women') : cat.gender;
      const imgSet = gender === 'women' ? womenImages : menUnisexImages;
      
      const names = productNames[catName] || ['Item'];
      const baseName = names[Math.floor(Math.random() * names.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      
      // Let's ensure slugs are unique by adding index or random string, we rely on the pre-save hook for slugs, 
      // but insertMany bypasses pre-save!
      // So we MUST generate slugs here manually.
      const rawTitle = `${brand} ${adj} ${baseName} - ${i}`;
      const slug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + i;
      
      const mrp = Math.floor(Math.random() * 45) * 100 + 599; // 599 to 4999
      const discountPct = [0, 10, 15, 20, 25, 30, 40, 50, 60][Math.floor(Math.random() * 9)];
      const price = Math.round(mrp * (1 - discountPct / 100));
      
      const fabric = fabrics[Math.floor(Math.random() * fabrics.length)];
      const fit = fits[Math.floor(Math.random() * fits.length)];
      const numColors = Math.floor(Math.random() * 3) + 1;
      const productColors = colors.sort(() => Math.random() - 0.5).slice(0, numColors);
      
      const img1 = imgSet[Math.floor(Math.random() * imgSet.length)];
      const img2 = imgSet[Math.floor(Math.random() * imgSet.length)];

      const isFeatured = Math.random() > 0.8;
      const isNewArrival = Math.random() > 0.8;

      const numReviews = Math.floor(Math.random() * 200);
      let avgRating = 0;
      if (numReviews > 0) {
        avgRating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
      }

      // Calculate stock
      const productSizes = sizes.map(s => ({ size: s, stock: Math.floor(Math.random() * 100) }));
      const totalStock = productSizes.reduce((sum, s) => sum + s.stock, 0);

      products.push({
        title: rawTitle,
        slug,
        brand,
        category: catName,
        subCategory: catName.toLowerCase(),
        description: `Experience the finest quality with this ${adj.toLowerCase()} ${baseName.toLowerCase()} from ${brand}. Crafted with premium ${fabric.toLowerCase()} for all-day comfort and a perfect ${fit.toLowerCase()}. Suitable for ${['casual', 'formal', 'party', 'sports'][Math.floor(Math.random()*4)]} occasions.`,
        shortDescription: `${adj} ${brand} ${baseName} in ${fabric}`,
        images: [img1, img2],
        mrp,
        price,
        discount: discountPct,
        sizes: productSizes,
        colors: productColors.map(c => ({ ...c, images: [img1] })),
        fabric,
        fit,
        occasion: ['Casual', 'Party', 'Formal', 'Sports', 'Ethnic'].sort(() => Math.random() - 0.5).slice(0, 2),
        washCare: 'Machine wash cold. Do not bleach. Tumble dry low.',
        gender: cat.gender === 'unisex' ? 'unisex' : cat.gender,
        tags: [catName.toLowerCase(), brand.toLowerCase(), gender, fabric.toLowerCase(), adj.toLowerCase()],
        avgRating,
        numReviews,
        totalStock,
        isFeatured,
        isNewArrival,
        isActive: true,
      });
    }

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      inserted += batch.length;
      console.log(`Successfully inserted ${inserted}/${products.length} products`);
    }

    console.log(`\n🎉 Seeded ${inserted} products successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed1000();
