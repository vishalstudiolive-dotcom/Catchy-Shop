import { Product, Banner } from '../types';

// Sample product images from Unsplash
const menImages = [
  ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=480&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=480&q=80'],
  ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=480&q=80','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=480&q=80'],
  ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=480&q=80','https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=480&q=80'],
  ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=480&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=480&q=80'],
  ['https://images.unsplash.com/photo-1434389677669-e08b4cda3a97?w=480&q=80','https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=480&q=80'],
];
const womenImages = [
  ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&q=80','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=480&q=80'],
  ['https://images.unsplash.com/photo-1502716119720-b23a1e3b3c42?w=480&q=80','https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=480&q=80'],
  ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=480&q=80','https://images.unsplash.com/photo-1550639525-c97d455acf70?w=480&q=80'],
  ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480&q=80','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=480&q=80'],
  ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=480&q=80'],
];

const brands = ['Nike','Puma','H&M','Zara','Levi\'s','Adidas','Allen Solly','Tommy Hilfiger','USPA','Roadster','Mango','Forever 21','GAP','Calvin Klein','Jack & Jones'];

function makeProduct(id: number, title: string, brand: string, cat: string, gender: 'men'|'women'|'kids'|'unisex', mrp: number, disc: number, imgs: string[], fabric: string, isFeatured=false, isNew=false): Product {
  const price = Math.round(mrp * (1 - disc/100));
  return {
    _id: `prod_${id.toString().padStart(3,'0')}`,
    title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    brand, description: `Premium quality ${title.toLowerCase()} from ${brand}. Crafted with the finest ${fabric.toLowerCase()} for ultimate comfort. Perfect for any occasion.`,
    shortDescription: `${brand} ${title}`,
    images: imgs, category: cat, subCategory: cat.toLowerCase(), mrp, price, discount: disc,
    sizes: [{size:'XS',stock:8},{size:'S',stock:15},{size:'M',stock:22},{size:'L',stock:18},{size:'XL',stock:12},{size:'XXL',stock:6}],
    colors: [{name:'Black',hex:'#000000'},{name:'Navy',hex:'#1B2A4A'},{name:'White',hex:'#FFFFFF'}],
    fabric, fit: ['Regular Fit','Slim Fit','Relaxed Fit'][id%3],
    occasion: ['Casual','Party','Formal'].slice(0,2), washCare: 'Machine wash cold. Do not bleach.',
    gender, tags: [cat.toLowerCase(),brand.toLowerCase()],
    avgRating: Math.round((3.5 + Math.random()*1.5)*10)/10,
    numReviews: Math.floor(Math.random()*400)+20,
    totalStock: 81, isActive: true, isFeatured, isNewArrival: isNew,
    reviews: [
      {_id:`r1_${id}`,user:{_id:'u1',name:'Rahul M.'},rating:5,title:'Amazing quality!',comment:'Excellent product, fits perfectly and the material is great.',helpfulVotes:24,verified:true,createdAt:'2025-12-15T10:00:00Z'},
      {_id:`r2_${id}`,user:{_id:'u2',name:'Priya S.'},rating:4,title:'Good value',comment:'Nice product for the price. Comfortable and stylish.',helpfulVotes:12,verified:true,createdAt:'2025-11-20T10:00:00Z'},
      {_id:`r3_${id}`,user:{_id:'u3',name:'Amit K.'},rating:4,title:'Decent buy',comment:'Good quality fabric. Delivery was on time.',helpfulVotes:8,verified:true,createdAt:'2025-10-05T10:00:00Z'}
    ]
  };
}

export const mockProducts: Product[] = [
  // Men's T-Shirts
  makeProduct(1,'Classic Crew Neck T-Shirt','Nike','T-Shirts','men',1499,40,menImages[0],'Cotton',true,true),
  makeProduct(2,'Graphic Print Tee','Puma','T-Shirts','men',1299,30,menImages[1],'Cotton',true,false),
  makeProduct(3,'Striped Polo T-Shirt','Tommy Hilfiger','T-Shirts','men',2999,35,menImages[2],'Cotton',false,true),
  makeProduct(4,'Oversized Urban Tee','H&M','T-Shirts','men',999,20,menImages[3],'Cotton',true,false),
  makeProduct(5,'V-Neck Essential Tee','Allen Solly','T-Shirts','men',899,25,menImages[4],'Cotton',false,true),
  // Men's Shirts
  makeProduct(6,'Oxford Button Down Shirt','USPA','Shirts','men',2499,30,menImages[0],'Cotton',true,false),
  makeProduct(7,'Slim Fit Formal Shirt','Calvin Klein','Shirts','men',3499,25,menImages[1],'Cotton',false,true),
  makeProduct(8,'Casual Check Shirt','Roadster','Shirts','men',1799,35,menImages[2],'Cotton',true,false),
  makeProduct(9,'Linen Summer Shirt','H&M','Shirts','men',1999,20,menImages[3],'Linen',false,true),
  makeProduct(10,'Denim Wash Shirt','Levi\'s','Shirts','men',2999,40,menImages[4],'Denim',true,false),
  // Men's Jeans
  makeProduct(11,'Slim Fit Stretch Jeans','Levi\'s','Jeans','men',2999,30,[menImages[3][0],menImages[4][0]],'Denim',true,true),
  makeProduct(12,'Classic Straight Leg Jeans','GAP','Jeans','men',2499,25,[menImages[4][0],menImages[3][0]],'Denim',false,false),
  makeProduct(13,'Ripped Skinny Jeans','Zara','Jeans','men',3499,40,[menImages[2][0],menImages[1][0]],'Denim',true,true),
  makeProduct(14,'Relaxed Cargo Jeans','H&M','Jeans','men',1999,20,[menImages[1][0],menImages[0][0]],'Denim',false,false),
  // Men's Jackets
  makeProduct(15,'Bomber Jacket','Nike','Jackets','men',4999,30,[menImages[0][0],menImages[2][0]],'Polyester',true,true),
  makeProduct(16,'Denim Classic Jacket','Levi\'s','Jackets','men',5499,35,[menImages[1][0],menImages[3][0]],'Denim',true,false),
  makeProduct(17,'Puffer Winter Jacket','Adidas','Jackets','men',6999,25,[menImages[4][0],menImages[0][0]],'Polyester',false,true),
  // Women's Dresses
  makeProduct(18,'Floral Maxi Dress','Zara','Dresses','women',3999,30,womenImages[0],'Rayon',true,true),
  makeProduct(19,'Bodycon Party Dress','Mango','Dresses','women',2999,40,womenImages[1],'Polyester',true,false),
  makeProduct(20,'A-Line Casual Dress','H&M','Dresses','women',1999,25,womenImages[2],'Cotton',false,true),
  makeProduct(21,'Wrap Midi Dress','Forever 21','Dresses','women',2499,35,womenImages[3],'Rayon',true,false),
  makeProduct(22,'Shirt Dress Striped','GAP','Dresses','women',2799,20,womenImages[4],'Cotton',false,true),
  // Women's Tops
  makeProduct(23,'Crop Top Basics','H&M','Tops','women',799,15,womenImages[0],'Cotton',true,true),
  makeProduct(24,'Ruffled Blouse','Zara','Tops','women',1999,30,womenImages[1],'Polyester',false,false),
  makeProduct(25,'Peasant Top Embroidered','Mango','Tops','women',1499,25,womenImages[2],'Cotton',true,true),
  makeProduct(26,'Peplum Formal Top','Allen Solly','Tops','women',1299,20,womenImages[3],'Polyester',false,false),
  makeProduct(27,'Off-Shoulder Knit Top','Forever 21','Tops','women',999,30,womenImages[4],'Cotton',true,true),
  // Women's Kurtas
  makeProduct(28,'Anarkali Embroidered Kurta','FabIndia','Kurtas','women',3499,25,[womenImages[0][0],womenImages[1][0]],'Silk',true,true),
  makeProduct(29,'Straight Cut Cotton Kurta','W','Kurtas','women',1499,20,[womenImages[1][0],womenImages[2][0]],'Cotton',false,false),
  makeProduct(30,'A-Line Printed Kurta','Biba','Kurtas','women',1999,30,[womenImages[2][0],womenImages[3][0]],'Cotton',true,true),
  makeProduct(31,'Palazzo Set Designer','AURELIA','Kurtas','women',2999,35,[womenImages[3][0],womenImages[4][0]],'Rayon',false,false),
  // Women's Skirts
  makeProduct(32,'Pleated Midi Skirt','Zara','Skirts','women',2499,30,[womenImages[4][0],womenImages[0][0]],'Polyester',true,false),
  makeProduct(33,'Denim Mini Skirt','H&M','Skirts','women',1299,25,[womenImages[3][0],womenImages[1][0]],'Denim',false,true),
  makeProduct(34,'Maxi Wrap Skirt','Mango','Skirts','women',2999,20,[womenImages[2][0],womenImages[4][0]],'Rayon',true,false),
  // Unisex
  makeProduct(35,'Classic White Sneakers','Nike','Sneakers','unisex',5999,25,menImages[0],'Leather',true,true),
  makeProduct(36,'Running Performance Shoes','Adidas','Sneakers','unisex',7999,30,menImages[1],'Mesh',true,false),
  makeProduct(37,'Retro Vintage Runner','Puma','Sneakers','unisex',4999,35,menImages[2],'Suede',false,true),
  makeProduct(38,'Chronograph Steel Watch','Tommy Hilfiger','Watches','unisex',8999,20,menImages[3],'Steel',true,true),
  makeProduct(39,'Minimalist Leather Watch','Calvin Klein','Watches','unisex',6999,25,menImages[4],'Leather',false,false),
  makeProduct(40,'Digital Sport Watch','Adidas','Watches','unisex',3999,30,menImages[0],'Rubber',true,false),
  // Kids
  makeProduct(41,'Kids Cartoon Print Tee','H&M','T-Shirts','kids',699,20,menImages[1],'Cotton',true,true),
  makeProduct(42,'Kids Denim Shorts','Zara','Jeans','kids',999,25,menImages[2],'Denim',false,false),
  makeProduct(43,'Kids Party Dress','Mango','Dresses','kids',1499,30,womenImages[0],'Polyester',true,true),
  makeProduct(44,'Kids Sneakers Velcro','Nike','Sneakers','kids',2499,20,menImages[3],'Mesh',false,true),
  makeProduct(45,'Kids Hoodie Pullover','Puma','Jackets','kids',1799,25,menImages[4],'Cotton',true,false),
  // More products for variety
  makeProduct(46,'Henley Full Sleeve Tee','Roadster','T-Shirts','men',1199,30,menImages[0],'Cotton',false,true),
  makeProduct(47,'Abstract Print Oversized','Jack & Jones','T-Shirts','men',1599,35,menImages[1],'Cotton',true,false),
  makeProduct(48,'Floral Summer Dress','Forever 21','Dresses','women',2299,40,womenImages[4],'Rayon',true,true),
  makeProduct(49,'High-Top Basketball Shoes','Nike','Sneakers','unisex',8499,20,menImages[2],'Leather',false,true),
  makeProduct(50,'Leather Biker Jacket','Zara','Jackets','men',9999,30,menImages[0],'Leather',true,true),
];

export const mockBanners: Banner[] = [
  { _id:'b1', title:'Summer Sale', subtitle:'Up to 60% OFF on trending styles', image:'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80', link:'/products?category=T-Shirts', ctaText:'Shop Now' },
  { _id:'b2', title:'New Collection', subtitle:'Fresh arrivals handpicked for you', image:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80', link:'/products?gender=women', ctaText:'Explore' },
  { _id:'b3', title:'Ethnic Wear', subtitle:'Festive collection starting ₹999', image:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80', link:'/products?category=Kurtas', ctaText:'Shop Ethnic' },
  { _id:'b4', title:'Sports Edit', subtitle:'Activewear for every workout', image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80', link:'/products?category=Sneakers', ctaText:'Get Moving' },
];

export const topBrands = [
  { name:'Nike', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png' },
  { name:'Puma', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_logo.svg/200px-Puma_logo.svg.png' },
  { name:'H&M', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/200px-H%26M-Logo.svg.png' },
  { name:'Zara', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/200px-Zara_Logo.svg.png' },
  { name:'Adidas', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png' },
  { name:'Levi\'s', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Levi-Strauss-Co-Logo.svg/200px-Levi-Strauss-Co-Logo.svg.png' },
  { name:'Tommy Hilfiger', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tommy_Hilfiger_wordmark.svg/200px-Tommy_Hilfiger_wordmark.svg.png' },
  { name:'Calvin Klein', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Calvin_Klein_Logo.svg/200px-Calvin_Klein_Logo.svg.png' },
];

export const categoryShortcuts = [
  { name:'Men', icon:'👔', link:'/products?gender=men', bg:'from-blue-500 to-blue-700' },
  { name:'Women', icon:'👗', link:'/products?gender=women', bg:'from-pink-500 to-rose-600' },
  { name:'Kids', icon:'🧒', link:'/products?gender=kids', bg:'from-yellow-400 to-orange-500' },
  { name:'Footwear', icon:'👟', link:'/products?category=Sneakers', bg:'from-green-500 to-emerald-600' },
  { name:'Ethnic', icon:'🪷', link:'/products?category=Kurtas', bg:'from-purple-500 to-violet-600' },
  { name:'Sports', icon:'🏃', link:'/products?category=T-Shirts&brand=Nike,Adidas,Puma', bg:'from-red-500 to-rose-600' },
  { name:'Watches', icon:'⌚', link:'/products?category=Watches', bg:'from-slate-600 to-slate-800' },
  { name:'Plus Size', icon:'✨', link:'/products?sizes=XL,XXL', bg:'from-teal-500 to-cyan-600' },
];

export const availableFilters = {
  categories: ['T-Shirts','Shirts','Jeans','Jackets','Dresses','Tops','Kurtas','Skirts','Sneakers','Watches'],
  brands: brands,
  sizes: ['XS','S','M','L','XL','XXL'],
  colors: [
    {name:'Black',hex:'#000000'},{name:'White',hex:'#FFFFFF'},{name:'Navy',hex:'#1B2A4A'},
    {name:'Red',hex:'#E53935'},{name:'Blue',hex:'#2196F3'},{name:'Green',hex:'#43A047'},
    {name:'Pink',hex:'#EC407A'},{name:'Grey',hex:'#9E9E9E'},{name:'Beige',hex:'#D4C5A9'},{name:'Maroon',hex:'#880E4F'},
  ],
  discounts: [10,20,30,40,50],
  fabrics: ['Cotton','Polyester','Silk','Denim','Linen','Rayon','Leather','Suede','Mesh'],
};
