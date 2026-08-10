import 'dotenv/config';
import connectDB from '../config/db.js';

// Development-only seed command.
// Usage: npm run seed:dev
// Refuses to run when NODE_ENV=production so a fresh production database
// always starts clean — production data is created only through the real application.

if (process.env.NODE_ENV === 'production') {
  console.error('✋ Refusing to seed: NODE_ENV=production. Development seed data must never run against a production database.');
  console.error('   Production starts with a clean database. Create real data through the application.');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  const { default: seedData } = await import('../utils/seedData.js');
  await seedData();
  console.log('✅ Development seed complete (uday_electrical_dev).');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
