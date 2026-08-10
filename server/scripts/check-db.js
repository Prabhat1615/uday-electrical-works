import 'dotenv/config';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

const run = async () => {
  await connectDB();
  
  const products = await Product.find({}, {category: 1, brand: 1, name: 1, sku: 1}).lean();
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];
  
  console.log('Total products in database:', products.length);
  console.log('Current categories:', categories);
  console.log('Current brands:', brands);
  console.log('\nSample products:');
  products.slice(0, 5).forEach(p => {
    console.log(`- ${p.name} (${p.brand}) - ${p.category} - SKU: ${p.sku}`);
  });
  
  process.exit(0);
};

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
