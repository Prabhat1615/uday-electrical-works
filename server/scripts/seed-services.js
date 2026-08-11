import 'dotenv/config';
import connectDB from '../config/db.js';
import Service from '../models/Service.js';

// Development-only service catalog seeding command.
// Usage: node scripts/seed-services.js
// Seeds the REAL service catalog offered by Uday Electrical Works (Jamshedpur).
// Idempotent: existing services are updated by title, never duplicated.

if (process.env.NODE_ENV === 'production') {
  console.error('✋ Refusing to seed: NODE_ENV=production. Service catalog seeding must never run against a production database.');
  process.exit(1);
}

const services = [
  {
    title: 'Fan Repair',
    category: 'Fan Repair',
    description: 'Ceiling, wall or table fan not running, noisy, slow speed or not rotating, diagnosis, repair and servicing at home.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 250
  },
  {
    title: 'Fan Installation',
    category: 'Fan Installation',
    description: 'New ceiling or wall fan installation, including bracket mounting, wiring and test run.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 400
  },
  {
    title: 'Exhaust Fan Installation',
    category: 'Exhaust Fan Repair',
    description: 'Kitchen or bathroom exhaust fan installation with proper duct and electrical connection.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 450
  },
  {
    title: 'Switch / Socket Repair',
    category: 'Switch Repair',
    description: 'Sparking, loose or dead switch/socket repair or replacement with genuine brand modules.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 200
  },
  {
    title: 'Light Installation',
    category: 'LED Light Installation',
    description: 'Ceiling light, LED battens, tube light and pendant light installation with fitting and wiring.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 350
  },
  {
    title: 'LED / Lighting Repair',
    category: 'LED Light Installation',
    description: 'Tubelight chok or starter not working, LED flickering or not glowing, on-site repair.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 200
  },
  {
    title: 'Wiring / Electrical Fault',
    category: 'House Wiring Repair',
    description: 'Tripping MCB, power loss in a room, loose connections, earthing faults and house wiring repairs.',
    estimatedDuration: '2-4 Hours',
    estimatedPrice: 500
  },
  {
    title: 'MCB / Distribution Board Service',
    category: 'MCB Replacement',
    description: 'MCB or distribution board replacement, circuit balancing and safety inspection.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 400
  },
  {
    title: 'Appliance Electrical Repair',
    category: 'Appliance Repair Services',
    description: 'Geyser, cooler, mixer, iron, kettle and water pump electrical repair at your doorstep.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 300
  },
  {
    title: 'General Electrical Service',
    category: 'Home Electrical Inspection',
    description: 'Complete home electrical safety check, wiring, switches, sockets, earthing and load check.',
    estimatedDuration: '2-3 Hours',
    estimatedPrice: 450
  }
];

const run = async () => {
  await connectDB();

  console.log('🔧 Starting service catalog seeding...');
  let inserted = 0;
  let updated = 0;

  for (const svc of services) {
    const existing = await Service.findOne({ title: svc.title });
    if (existing) {
      await Service.updateOne({ title: svc.title }, { $set: svc });
      console.log(`🔄 Updated: ${svc.title}`);
      updated++;
    } else {
      await Service.create(svc);
      console.log(`✅ Inserted: ${svc.title}`);
      inserted++;
    }
  }

  console.log(`\n✅ Service catalog seeding complete. Inserted: ${inserted}, Updated: ${updated}`);
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
