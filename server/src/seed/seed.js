import dotenv from 'dotenv';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database seeding...');
    await connectDB();

    // 1. Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Product.deleteMany({});
    await Setting.deleteMany({});

    console.log('[Seed] Cleared old collections.');

    // 2. Create Admin & Demo Customer
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@draksha.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    await User.create({
      name: 'Restaurant Administrator',
      email: adminEmail.toLowerCase(),
      phone: '+91 98765 00000',
      password: adminPassword,
      role: 'admin',
    });

    await User.create({
      name: 'Demo Customer',
      email: 'customer@example.com',
      phone: '+91 98765 11111',
      password: 'password123',
      role: 'customer',
    });

    console.log(`[Seed] Created Admin user (${adminEmail}) and Demo Customer.`);

    // 3. Create Settings
    await Setting.create({
      restaurantName: 'Draksha Dessert & Café',
      phone: '+91 98765 43210',
      email: 'contact@draksha.com',
      address: '45 Gourmet Avenue, Chocolate District, Hyderabad',
      openingHours: '11:00 AM - 11:30 PM (Everyday)',
      taxRate: 5,
      deliveryFee: 40,
      currency: '₹',
      isOpen: true,
    });

    // 4. Categories & Subcategories
    const categoriesData = [
      {
        name: 'Waffles',
        description: 'Golden Belgian waffles baked crisp on the outside, light and fluffy on the inside with melted chocolate.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
      {
        name: 'Non-Veg',
        description: 'Savoury, crispy chicken delights, burgers, tenders, and gourmet rolls.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
      },
      {
        name: 'Brownies',
        description: 'Rich, fudgy chocolate brownies served warm with chocolate sauce, biscoff & ice cream.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        displayOrder: 3,
      },
      {
        name: 'Scoops',
        description: 'Artisanal ice cream scoops in timeless classic and exotic gourmet flavours.',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80',
        displayOrder: 4,
      },
      {
        name: 'Veg',
        description: 'Delicious vegetarian snacks, crispy fries, wraps, momos, and street food classics.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        displayOrder: 5,
      },
      {
        name: 'Milk Shakes',
        description: 'Thick, creamy signature milkshakes blended with chocolate, berries, and dry fruits.',
        image: '/uploads/chocolate_milkshake.jpg',
        displayOrder: 6,
      },
      {
        name: 'Kunafa',
        description: 'Traditional Middle-Eastern golden crispy spun pastry stuffed with melted cheese, Nutella, Lotus Biscoff, and pistachios.',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
        displayOrder: 7,
      },
      {
        name: 'Pizza',
        description: 'Freshly baked golden artisanal pizzas topped with rich mozzarella cheese, herbs, corn, paneer, and chicken.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        displayOrder: 8,
      },
      {
        name: 'Mojitos',
        description: 'Refreshing sparkling mocktails and muddled citrus drinks with fresh mint, lime, Blue Curacao, and berries.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        displayOrder: 9,
      },
    ];

    const categoryMap = {};

    for (const catData of categoriesData) {
      const slug = slugify(catData.name, { lower: true, strict: true });
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({
          name: catData.name,
          slug,
          description: catData.description,
          image: catData.image,
          isActive: true,
          displayOrder: catData.displayOrder,
        });
      } else {
        cat.name = catData.name;
        cat.description = catData.description;
        cat.image = catData.image;
        cat.displayOrder = catData.displayOrder;
        await cat.save();
      }
      categoryMap[catData.name] = cat;
    }

    // Subcategories
    const dipsSubcat = await Subcategory.create({
      categoryId: categoryMap['Brownies']._id,
      name: 'Chocolate Fountain Dips',
      slug: 'chocolate-fountain-dips',
      description: 'Decadent cake sticks, marshmallows, cones & pani puris dipped in molten chocolate.',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 1,
    });

    console.log('[Seed] Categories & Subcategories created.');

    // 5. Products Data
    const productsSeed = [
      // --- WAFFLES ---
      {
        category: 'Waffles',
        name: 'Dark, Milk, White Waffle',
        foodType: 'veg',
        description: 'Belgian waffle drizzled with melted dark, milk, and white chocolate.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isFeatured: true,
        variants: [
          { name: 'Single', price: 70 },
          { name: 'Double', price: 130 },
          { name: 'Full', price: 250 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Dark, White Waffle',
        foodType: 'veg',
        description: 'Crispy waffle layered with silky dark and white Belgian chocolate.',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
        variants: [
          { name: 'Single', price: 70 },
          { name: 'Double', price: 130 },
          { name: 'Full', price: 250 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Oreo Waffle',
        foodType: 'veg',
        description: 'Fresh waffle topped with crushed Oreo cookies and warm cream chocolate.',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [
          { name: 'Single', price: 80 },
          { name: 'Double', price: 150 },
          { name: 'Full', price: 280 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Kit Kat Waffle',
        foodType: 'veg',
        description: 'Crispy waffle loaded with crunchy Kit Kat pieces and chocolate sauce.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        variants: [
          { name: 'Single', price: 80 },
          { name: 'Double', price: 150 },
          { name: 'Full', price: 280 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Dry Nuts Waffle',
        foodType: 'veg',
        description: 'Gourmet waffle coated with roasted almonds, cashews, pistachios & honey chocolate.',
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
        variants: [
          { name: 'Single', price: 90 },
          { name: 'Double', price: 170 },
          { name: 'Full', price: 320 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Choco Chips Waffle',
        foodType: 'veg',
        description: 'Fresh baked waffle packed with dark and milk chocolate chips.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        variants: [
          { name: 'Single', price: 80 },
          { name: 'Double', price: 150 },
          { name: 'Full', price: 290 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Waffle With Ice',
        foodType: 'veg',
        description: 'Warm waffle served alongside a creamy scoop of vanilla ice cream.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        variants: [
          { name: 'Single', price: 90 },
          { name: 'Double', price: 170 },
          { name: 'Full', price: 320 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Naughty Nutella Waffle',
        foodType: 'veg',
        description: 'Decadent waffle smothered in original rich hazelnut Nutella spread.',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [
          { name: 'Double', price: 180 },
          { name: 'Full', price: 340 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Biscoff Waffle',
        foodType: 'veg',
        description: 'Warm Belgian waffle topped with Lotus Biscoff spread and crushed Biscoff crumbs.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [
          { name: 'Double', price: 180 },
          { name: 'Full', price: 340 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Kunafa Waffle',
        foodType: 'veg',
        description: 'Middle-Eastern inspired crispy Kunafa waffle infused with sweet syrup and pistachios.',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [
          { name: 'Double', price: 180 },
          { name: 'Full', price: 340 },
        ],
      },
      {
        category: 'Waffles',
        name: 'Kiki Oreo Waffle',
        foodType: 'veg',
        description: 'Signature extra loaded Oreo chocolate fudge waffle delight.',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
        variants: [
          { name: 'Double', price: 190 },
          { name: 'Full', price: 360 },
        ],
      },

      // --- NON-VEG ---
      {
        category: 'Non-Veg',
        name: 'Chicken Nuggets',
        foodType: 'non-veg',
        description: 'Golden crispy fried chicken nuggets served with signature mayo dip.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '4 pcs', price: 60 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Fingers',
        foodType: 'non-veg',
        description: 'Tender chicken strips coated in seasoned crispy breadcrumbs.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '3 pcs', price: 70 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Cheese Balls',
        foodType: 'non-veg',
        description: 'Molten cheese stuffed chicken balls fried to golden perfection.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: '4 pcs', price: 80 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Rolls',
        foodType: 'non-veg',
        description: 'Soft paratha wrap stuffed with spiced grilled chicken and fresh herbs.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '2 pcs', price: 80 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Lolipop (Single)',
        foodType: 'non-veg',
        description: 'Crispy fried chicken wingette drumette seasoned with spicy rub.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '1 pc', price: 50 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Lolipop Bucket',
        foodType: 'non-veg',
        description: 'Shareable bucket of 6 juicy spicy chicken lolipops.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: '6 pcs', price: 250 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Burger',
        foodType: 'non-veg',
        description: 'Juicy fried chicken patty with lettuce, cheese, and spicy mayo in toasted bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [{ name: 'Regular', price: 90 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Wrap',
        foodType: 'non-veg',
        description: 'Warm tortilla wrapped with crispy chicken tenders, fresh veggies and dressing.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 90 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Tenders',
        foodType: 'non-veg',
        description: '200 grams of boneless, juicy crispy chicken tenders served with dips.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '200 grams', price: 250 }],
      },
      {
        category: 'Non-Veg',
        name: 'Extra Cheese Add-on',
        foodType: 'non-veg',
        description: 'Melted cheese slice or sauce add-on for any savoury item.',
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 10 }],
      },
      {
        category: 'Non-Veg',
        name: 'Chicken Loaded French Fries',
        foodType: 'non-veg',
        description: 'Crispy french fries loaded with shredded chicken, jalapeños, and cheese sauce.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Regular', price: 150 }],
      },

      // --- BROWNIES ---
      {
        category: 'Brownies',
        name: 'Chocolate Over Load Brownie',
        foodType: 'veg',
        description: 'Dense fudgy dark chocolate brownie drenched in warm liquid chocolate.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Regular', price: 110 }],
      },
      {
        category: 'Brownies',
        name: 'Triple Layer Brownie',
        foodType: 'veg',
        description: 'Decadent 3-layered chocolate brownie with dark, milk, and white chocolate ganache.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 110 }],
      },
      {
        category: 'Brownies',
        name: 'Brownie With Ice Cream',
        foodType: 'veg',
        description: 'Sizzling warm brownie paired with a scoop of Madagascar vanilla ice cream.',
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [{ name: 'Regular', price: 130 }],
      },
      {
        category: 'Brownies',
        name: 'Naughty Nutella Brownie',
        foodType: 'veg',
        description: 'Freshly baked brownie topped with hazelnut Nutella and crushed hazelnut bits.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Brownies',
        name: 'Biscoff Brownie',
        foodType: 'veg',
        description: 'Fudgy brownie glazed with Lotus Biscoff spread and cookie crumbles.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Brownies',
        name: 'Kunafa Brownie',
        foodType: 'veg',
        description: 'Fusion dessert featuring chocolate brownie wrapped with crisp golden Kunafa threads.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Brownies',
        name: 'Choco Lava Cake',
        foodType: 'veg',
        description: 'Moist chocolate cake with a molten liquid chocolate center.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 100 }],
      },

      // --- BROWNIE SUBCATEGORY: Chocolate Fountain Dips ---
      {
        category: 'Brownies',
        subcategory: 'Chocolate Fountain Dips',
        name: 'Cake Stick Dip',
        foodType: 'veg',
        description: 'Soft vanilla sponge cake stick dipped in warm flowing chocolate fountain.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 40 }],
      },
      {
        category: 'Brownies',
        subcategory: 'Chocolate Fountain Dips',
        name: 'Marshmallow Dip',
        foodType: 'veg',
        description: 'Fluffy marshmallows coated in rich chocolate fountain dip.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 40 }],
      },
      {
        category: 'Brownies',
        subcategory: 'Chocolate Fountain Dips',
        name: 'Cone Dip',
        foodType: 'veg',
        description: 'Crispy waffle cone filled with warm melted chocolate sauce.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 50 }],
      },
      {
        category: 'Brownies',
        subcategory: 'Chocolate Fountain Dips',
        name: 'Chocolate Pani Puri',
        foodType: 'veg',
        description: 'Crispy puris stuffed with nuts and filled with warm melted Belgian chocolate fountain dip.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [{ name: 'Regular', price: 50 }],
      },

      // --- SCOOPS ---
      {
        category: 'Scoops',
        name: 'Vanilla Scoop',
        foodType: 'veg',
        description: 'Classic creamy Madagascar vanilla ice cream scoop.',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 50 }],
      },
      {
        category: 'Scoops',
        name: 'Chocolate Scoop',
        foodType: 'veg',
        description: 'Rich dark Dutch cocoa chocolate ice cream scoop.',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 60 }],
      },
      {
        category: 'Scoops',
        name: 'Butter Scotch Scoop',
        foodType: 'veg',
        description: 'Sweet butterscotch ice cream embedded with crunchy praline bits.',
        image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 50 }],
      },
      {
        category: 'Scoops',
        name: 'Strawberry Scoop',
        foodType: 'veg',
        description: 'Fresh strawberry ice cream with real fruit preserve ripples.',
        image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 60 }],
      },
      {
        category: 'Scoops',
        name: 'Mango Scoop',
        foodType: 'veg',
        description: 'Sun-ripened Alphonso mango ice cream scoop.',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 60 }],
      },
      {
        category: 'Scoops',
        name: 'Honey Almond Scoop',
        foodType: 'veg',
        description: 'Honey infused ice cream loaded with toasted almond flakes.',
        image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 70 }],
      },
      {
        category: 'Scoops',
        name: 'Black Current Scoop',
        foodType: 'veg',
        description: 'Tangy-sweet black currant berry ice cream scoop.',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 70 }],
      },
      {
        category: 'Scoops',
        name: 'Dry Fruit Temptation',
        foodType: 'veg',
        description: 'Royal ice cream scoop packed with cashews, raisins, pistachios & saffron.',
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Single Scoop', price: 70 }],
      },
      {
        category: 'Scoops',
        name: 'Apricot Delite Sundae',
        foodType: 'veg',
        description: 'Signature sundae loaded with stewed apricots, cream, and dry fruit ice cream.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isImageVerified: true,
        variants: [{ name: 'Sundae', price: 150 }],
      },
      {
        category: 'Scoops',
        name: 'Grand Delite Sundae',
        foodType: 'veg',
        description: 'Multi-scoop sundae topped with nuts, cherries, chocolate sauce and crisp wafer.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Sundae', price: 150 }],
      },
      {
        category: 'Scoops',
        name: 'Chocolate Mousse Sundae',
        foodType: 'veg',
        description: 'Velvety dark chocolate mousse layered with chocolate ice cream and brownie crumbs.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Sundae', price: 150 }],
      },

      // --- VEG ---
      {
        category: 'Veg',
        name: 'Hot Vegetable Soup',
        foodType: 'veg',
        description: 'Comforting warm spiced vegetable clear soup with sweetcorn.',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Bowl', price: 30 }],
      },
      {
        category: 'Veg',
        name: 'Veg Nuggets',
        foodType: 'veg',
        description: 'Crispy veggie nuggets filled with corn, potatoes, and peas.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '5 pcs', price: 60 }],
      },
      {
        category: 'Veg',
        name: 'Veg Fingers',
        foodType: 'veg',
        description: 'Crispy spiced vegetable finger sticks served with tangy ketchup.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '3 pcs', price: 60 }],
      },
      {
        category: 'Veg',
        name: 'French Fries (Salted)',
        foodType: 'veg',
        description: 'Classic crispy salted golden potato french fries.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Veg',
        name: 'French Fries (Masala)',
        foodType: 'veg',
        description: 'French fries tossed in peri-peri and Indian chaat masala spices.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Regular', price: 70 }],
      },
      {
        category: 'Veg',
        name: 'Spring Potato',
        foodType: 'veg',
        description: 'Spiral potato stick fried crispy and dusted with peri-peri seasoning.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '1 stick', price: 50 }],
      },
      {
        category: 'Veg',
        name: 'Veg Roll',
        foodType: 'veg',
        description: 'Crispy fried rolls stuffed with seasoned noodles and vegetables.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '2 pcs', price: 70 }],
      },
      {
        category: 'Veg',
        name: 'Veg Wrap',
        foodType: 'veg',
        description: 'Fresh tortilla wrap with crispy veggie patty, lettuce, tomatoes, and mayo.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '1 pc', price: 80 }],
      },
      {
        category: 'Veg',
        name: 'Veg Lolipop',
        foodType: 'veg',
        description: 'Crispy veggie lolipop balls skewered on sticks with spicy red sauce.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '5 pcs', price: 100 }],
      },
      {
        category: 'Veg',
        name: 'Veg Momos',
        foodType: 'veg',
        description: 'Steamed or fried vegetable dumplings served with spicy garlic momo chutney.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: '4 pcs', price: 100 }],
      },
      {
        category: 'Veg',
        name: 'Veg Burger',
        foodType: 'veg',
        description: 'Crispy spiced potato vegetable patty burger with fresh veggies and mayonnaise.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 80 }],
      },
      {
        category: 'Veg',
        name: 'Paneer Roll',
        foodType: 'veg',
        description: 'Soft paratha wrap loaded with spicy cottage cheese tikka cubes.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [{ name: '2 pcs', price: 100 }],
      },
      {
        category: 'Veg',
        name: 'McCain Smileys',
        foodType: 'veg',
        description: 'Crispy smiley potato bites loved by all ages.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: '4 pcs', price: 50 }],
      },
      {
        category: 'Veg',
        name: 'Classic Pani Puri',
        foodType: 'veg',
        description: 'Crispy hollow puris filled with spiced potato potato water and sweet chutney.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Plate', price: 20 }],
      },
      {
        category: 'Veg',
        name: 'Veg Loaded French Fries',
        foodType: 'veg',
        description: 'Golden fries loaded with molten cheddar cheese sauce, jalapenos, and herbs.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 120 }],
      },

      // --- MILK SHAKES ---
      {
        category: 'Milk Shakes',
        name: 'Vanilla Milkshake',
        foodType: 'veg',
        scope: 'Classic smooth milkshake prepared with pure Madagascar vanilla beans, chilled milk and vanilla ice cream, offering a rich classic flavor.',
        description: 'Classic smooth milkshake prepared with pure Madagascar vanilla beans, chilled milk and vanilla ice cream, offering a rich classic flavor.',
        image: '/uploads/vanilla_milkshake.jpg',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Chocolate Milkshake',
        foodType: 'veg',
        scope: 'Creamy milkshake prepared with rich Dutch dark chocolate cocoa, chilled milk and chocolate ice cream, topped with chocolate drizzle.',
        description: 'Creamy milkshake prepared with rich Dutch dark chocolate cocoa, chilled milk and chocolate ice cream, topped with chocolate drizzle.',
        image: '/uploads/chocolate_milkshake.jpg',
        isPopular: true,
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Butterscotch Milkshake',
        foodType: 'veg',
        scope: 'Creamy butterscotch shake blended with butter crunch praline, milk and ice cream, topped with golden caramel glaze.',
        description: 'Creamy butterscotch shake blended with butter crunch praline, milk and ice cream, topped with golden caramel glaze.',
        image: '/uploads/butterscotch_milkshake.jpg',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Caramel Milkshake',
        foodType: 'veg',
        scope: 'Luscious thickshake prepared with rich salted caramel sauce, milk and vanilla ice cream, topped with fluffy whipped cream.',
        description: 'Luscious thickshake prepared with rich salted caramel sauce, milk and vanilla ice cream, topped with fluffy whipped cream.',
        image: '/uploads/butterscotch_milkshake.jpg',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Mango Milkshake',
        foodType: 'veg',
        scope: 'Refreshing milkshake made with ripe Alphonso mango pulp, chilled milk and vanilla ice cream, with a naturally sweet tropical flavor.',
        description: 'Refreshing milkshake made with ripe Alphonso mango pulp, chilled milk and vanilla ice cream, with a naturally sweet tropical flavor.',
        image: '/uploads/mango_milkshake.jpg',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Kiwi Milkshake',
        foodType: 'veg',
        scope: 'Vibrant green milkshake blended with fresh kiwi fruit pulp, chilled milk and ice cream, delivering a refreshing tangy-sweet profile.',
        description: 'Vibrant green milkshake blended with fresh kiwi fruit pulp, chilled milk and ice cream, delivering a refreshing tangy-sweet profile.',
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Strawberry Milkshake',
        foodType: 'veg',
        scope: 'Creamy pink milkshake prepared with sweet fresh strawberries, chilled milk and ice cream, topped with strawberry syrup glaze.',
        description: 'Creamy pink milkshake prepared with sweet fresh strawberries, chilled milk and ice cream, topped with strawberry syrup glaze.',
        image: '/uploads/strawberry_milkshake.jpg',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Water Melon Shake',
        foodType: 'veg',
        scope: 'Hydrating and refreshing milkshake prepared with fresh juicy watermelon pulp, cold milk and ice cream, creating a light summer treat.',
        description: 'Hydrating and refreshing milkshake prepared with fresh juicy watermelon pulp, cold milk and ice cream, creating a light summer treat.',
        image: 'https://images.unsplash.com/photo-1589733955941-5eeaf7543496?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Kit Kat Milkshake',
        foodType: 'veg',
        scope: 'Thick chocolate milkshake blended with crunchy Kit Kat wafer bars, chocolate syrup, milk and vanilla ice cream, topped with wafer crumbles.',
        description: 'Thick chocolate milkshake blended with crunchy Kit Kat wafer bars, chocolate syrup, milk and vanilla ice cream, topped with wafer crumbles.',
        image: '/uploads/kitkat_milkshake.jpg',
        isPopular: true,
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Oreo Milkshake',
        foodType: 'veg',
        scope: 'All-time favorite thickshake blended with crunchy Oreo cookies, milk and vanilla ice cream, topped with crushed cookie crumbs.',
        description: 'All-time favorite thickshake blended with crunchy Oreo cookies, milk and vanilla ice cream, topped with crushed cookie crumbs.',
        image: '/uploads/oreo_milkshake.jpg',
        isPopular: true,
        variants: [{ name: 'Regular', price: 120 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Black Current Shake',
        foodType: 'veg',
        scope: 'Indulgent purple milkshake prepared with tangy black currant berries, milk and ice cream, delivering a bold fruity berry taste.',
        description: 'Indulgent purple milkshake prepared with tangy black currant berries, milk and ice cream, delivering a bold fruity berry taste.',
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Pista Milkshake',
        foodType: 'veg',
        scope: 'Nutty light-green milkshake blended with roasted pistachios, milk, aromatic cardamom, and vanilla ice cream.',
        description: 'Nutty light-green milkshake blended with roasted pistachios, milk, aromatic cardamom, and vanilla ice cream.',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Dry Fruits Milkshake',
        foodType: 'veg',
        scope: 'Royal energizing milkshake blended with premium almonds, cashews, dates, pistachios, saffron, and rich ice cream.',
        description: 'Royal energizing milkshake blended with premium almonds, cashews, dates, pistachios, saffron, and rich ice cream.',
        image: 'https://images.unsplash.com/photo-1517093157656-b9ecdf173b31?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Nutella Milkshake',
        foodType: 'veg',
        scope: 'Ultra-rich hazelnut chocolate milkshake blended with generous spoonfuls of original Nutella, milk, and chocolate ice cream.',
        description: 'Ultra-rich hazelnut chocolate milkshake blended with generous spoonfuls of original Nutella, milk, and chocolate ice cream.',
        image: '/uploads/chocolate_milkshake.jpg',
        isFeatured: true,
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Biscoff Milkshake',
        foodType: 'veg',
        scope: 'Signature spiced caramel thickshake blended with Lotus Biscoff biscuit spread, milk, and ice cream, topped with caramelized cookie crumbles.',
        description: 'Signature spiced caramel thickshake blended with Lotus Biscoff biscuit spread, milk, and ice cream, topped with caramelized cookie crumbles.',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Milk Shakes',
        name: 'Banana Milkshake',
        foodType: 'veg',
        scope: 'Smooth and creamy milkshake made with ripe banana slices, chilled milk and vanilla ice cream, offering a naturally sweet banana flavor.',
        description: 'Smooth and creamy milkshake made with ripe banana slices, chilled milk and vanilla ice cream, offering a naturally sweet banana flavor.',
        image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=800&q=80',
        variants: [{ name: 'Regular', price: 120 }],
      },

      // --- KUNAFA ---
      {
        category: 'Kunafa',
        name: 'Cheese Kunafa',
        foodType: 'veg',
        scope: 'Classic Middle-Eastern shredded pastry baked golden with a rich melted cheese center and sweet rose syrup drizzle.',
        description: 'Classic Middle-Eastern shredded pastry baked golden with a rich melted cheese center and sweet rose syrup drizzle.',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 280 }],
      },
      {
        category: 'Kunafa',
        name: 'Ice Cream Kunafa',
        foodType: 'veg',
        scope: 'Crispy warm golden Kunafa paired with a luxurious scoop of Madagascar vanilla ice cream.',
        description: 'Crispy warm golden Kunafa paired with a luxurious scoop of Madagascar vanilla ice cream.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 300 }],
      },
      {
        category: 'Kunafa',
        name: 'Nutella Kunafa',
        foodType: 'veg',
        scope: 'Crispy shredded pastry smothered in warm, rich Nutella hazelnut chocolate sauce.',
        description: 'Crispy shredded pastry smothered in warm, rich Nutella hazelnut chocolate sauce.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 300 }],
      },
      {
        category: 'Kunafa',
        name: 'Lotus Biscoff Kunafa',
        foodType: 'veg',
        scope: 'Decadent Kunafa drizzled with creamy Lotus Biscoff spread and caramelized Biscoff cookie crumbs.',
        description: 'Decadent Kunafa drizzled with creamy Lotus Biscoff spread and caramelized Biscoff cookie crumbs.',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 310 }],
      },
      {
        category: 'Kunafa',
        name: 'Pistachio Kunafa',
        foodType: 'veg',
        scope: 'Royal Middle-Eastern Kunafa topped with rich pistachio cream and roasted crushed Iranian pistachios.',
        description: 'Royal Middle-Eastern Kunafa topped with rich pistachio cream and roasted crushed Iranian pistachios.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 310 }],
      },

      // --- PIZZA ---
      {
        category: 'Pizza',
        name: 'Veg Pizza',
        foodType: 'veg',
        scope: 'Hand-tossed golden crust topped with Italian tomato sauce, melted mozzarella, bell peppers, onions, and olives.',
        description: 'Hand-tossed golden crust topped with Italian tomato sauce, melted mozzarella, bell peppers, onions, and olives.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 140 }],
      },
      {
        category: 'Pizza',
        name: 'Corn Pizza',
        foodType: 'veg',
        scope: 'Delicious pizza topped with sweet golden corn kernels, creamy mozzarella, and Italian herbs.',
        description: 'Delicious pizza topped with sweet golden corn kernels, creamy mozzarella, and Italian herbs.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 150 }],
      },
      {
        category: 'Pizza',
        name: 'Paneer Pizza',
        foodType: 'veg',
        scope: 'Gourmet pizza loaded with marinated spiced paneer cubes, capsicum, onions, and extra cheese.',
        description: 'Gourmet pizza loaded with marinated spiced paneer cubes, capsicum, onions, and extra cheese.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 160 }],
      },
      {
        category: 'Pizza',
        name: 'Italian Pizza',
        foodType: 'veg',
        scope: 'Classic Italian style pizza with tangy marinara sauce, fresh basil, cherry tomatoes, and mozzarella cheese.',
        description: 'Classic Italian style pizza with tangy marinara sauce, fresh basil, cherry tomatoes, and mozzarella cheese.',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 180 }],
      },
      {
        category: 'Pizza',
        name: 'Chicken Pizza',
        foodType: 'non-veg',
        scope: 'Crispy oven-baked crust topped with seasoned grilled chicken chunks, onions, and melted cheese.',
        description: 'Crispy oven-baked crust topped with seasoned grilled chicken chunks, onions, and melted cheese.',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 180 }],
      },
      {
        category: 'Pizza',
        name: 'Cheese Pizza',
        foodType: 'veg',
        scope: 'Ultimate cheese lovers pizza loaded with a rich four-cheese blend of mozzarella, cheddar, and parmesan.',
        description: 'Ultimate cheese lovers pizza loaded with a rich four-cheese blend of mozzarella, cheddar, and parmesan.',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 200 }],
      },

      // --- MOJITOS ---
      {
        category: 'Mojitos',
        name: 'Blue Curacao',
        foodType: 'veg',
        scope: 'Vibrant blue tropical mocktail prepared with blue curacao syrup, muddled fresh mint, lime, and sparkling soda.',
        description: 'Vibrant blue tropical mocktail prepared with blue curacao syrup, muddled fresh mint, lime, and sparkling soda.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Mojitos',
        name: 'Mint Lime',
        foodType: 'veg',
        scope: 'Classic refreshing mojito crushed with fresh garden mint leaves, tangy lime juice, sugar, and chilled soda.',
        description: 'Classic refreshing mojito crushed with fresh garden mint leaves, tangy lime juice, sugar, and chilled soda.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Mojitos',
        name: 'Strawberry Mojito',
        foodType: 'veg',
        scope: 'Sweet and zesty mojito muddled with real strawberry puree, fresh mint leaves, lime wedges, and fizz.',
        description: 'Sweet and zesty mojito muddled with real strawberry puree, fresh mint leaves, lime wedges, and fizz.',
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Mojitos',
        name: 'Watermelon Mojito',
        foodType: 'veg',
        scope: 'Hydrating summer cooler muddled with fresh watermelon juice, garden mint, lime, and crushed ice.',
        description: 'Hydrating summer cooler muddled with fresh watermelon juice, garden mint, lime, and crushed ice.',
        image: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Mojitos',
        name: 'Mango Mojito',
        foodType: 'veg',
        scope: 'Tropical fruity mocktail prepared with sweet Alphonso mango pulp, fresh mint, lime, and sparkling soda.',
        description: 'Tropical fruity mocktail prepared with sweet Alphonso mango pulp, fresh mint, lime, and sparkling soda.',
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Mojitos',
        name: 'Kiwi Mojito',
        foodType: 'veg',
        scope: 'Tangy green mocktail infused with fresh crushed kiwi fruit, mint leaves, lime juice, and soda fizz.',
        description: 'Tangy green mocktail infused with fresh crushed kiwi fruit, mint leaves, lime juice, and soda fizz.',
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80',
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
      {
        category: 'Mojitos',
        name: 'Blueberry Mojito',
        foodType: 'veg',
        scope: 'Exotic berry mocktail muddled with ripe wild blueberries, fresh mint, lime juice, and crushed ice.',
        description: 'Exotic berry mocktail muddled with ripe wild blueberries, fresh mint, lime juice, and crushed ice.',
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isImageVerified: true,
        variants: [{ name: 'Regular', price: 60 }],
      },
    ];

    let count = 0;
    for (const item of productsSeed) {
      const parentCat = categoryMap[item.category];
      if (!parentCat) continue;

      let subcatId = undefined;
      if (item.subcategory) {
        if (item.subcategory === 'Chocolate Fountain Dips') {
          subcatId = dipsSubcat._id;
        }
      }

      let baseSlug = slugify(item.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
      }

      await Product.create({
        categoryId: parentCat._id,
        subcategoryId: subcatId,
        name: item.name,
        slug,
        description: item.description || item.scope || '',
        scope: item.scope || item.description || '',
        image: item.image,
        foodType: item.foodType,
        variants: item.variants,
        isAvailable: true,
        isFeatured: item.isFeatured || false,
        isPopular: item.isPopular || false,
        isImageVerified: item.isImageVerified !== undefined ? item.isImageVerified : true,
        displayOrder: count++,
      });
    }

    console.log(`[Seed] Seeded ${count} menu products into MongoDB.`);
    console.log('[Seed] Database seeding completed successfully!');
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
