import 'dotenv/config';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { productCatalog } from '../utils/productCatalogData.js';

// Development-only product catalog seeding command.
// Usage: node scripts/seed-product-catalog.js
// Updates or inserts verified product imagery and model details.

if (process.env.NODE_ENV === 'production') {
  console.error('✋ Refusing to seed: NODE_ENV=production. Product catalog seeding must never run against a production database.');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  
  console.log('📦 Starting verified product catalog seeding...');
  console.log(`📋 Total products to process: ${productCatalog.length}`);
  
  let inserted = 0;
  let updated = 0;
  let failed = 0;
  
  for (const productData of productCatalog) {
    try {
      const existingProduct = await Product.findOne({ sku: productData.sku });
      
      if (existingProduct) {
        await Product.updateOne({ sku: productData.sku }, { $set: productData });
        console.log(`🔄 Updated: ${productData.name} (SKU: ${productData.sku})`);
        updated++;
      } else {
        await Product.create(productData);
        console.log(`✅ Inserted: ${productData.name} (SKU: ${productData.sku})`);
        inserted++;
      }
    } catch (error) {
      console.error(`❌ Failed: ${productData.name} (SKU: ${productData.sku}) - ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n📊 Seeding Summary:');
  console.log(`   ✅ Inserted: ${inserted}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📋 Total processed: ${productCatalog.length}`);
  
  if (failed > 0) {
    console.error('\n⚠️ Some products failed to process.');
    process.exit(1);
  }
  
  console.log('\n✅ Product catalog seeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
