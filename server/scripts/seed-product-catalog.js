import 'dotenv/config';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { productCatalog } from '../utils/productCatalogData.js';

// Development-only product catalog seeding command.
// Usage: node scripts/seed-product-catalog.js
// This script is idempotent - it checks if a product with the same SKU already exists
// and skips insertion to avoid duplicates.
// Stock is set to 0 for catalog showcase purposes (no fake inventory).

if (process.env.NODE_ENV === 'production') {
  console.error('✋ Refusing to seed: NODE_ENV=production. Product catalog seeding must never run against a production database.');
  console.error('   Production starts with a clean database. Create real products through the application.');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  
  console.log('📦 Starting product catalog seeding...');
  console.log(`📋 Total products to process: ${productCatalog.length}`);
  
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const productData of productCatalog) {
    try {
      // Check if product already exists by SKU
      const existingProduct = await Product.findOne({ sku: productData.sku });
      
      if (existingProduct) {
        console.log(`⏭️  Skipped: ${productData.name} (SKU: ${productData.sku}) - already exists`);
        skipped++;
      } else {
        // Create new product
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
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📋 Total processed: ${productCatalog.length}`);
  
  if (failed > 0) {
    console.error('\n⚠️  Some products failed to insert. Please check the errors above.');
    process.exit(1);
  }
  
  console.log('\n✅ Product catalog seeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
