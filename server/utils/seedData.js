import User from '../models/User.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Supplier from '../models/Supplier.js';
import Warehouse from '../models/Warehouse.js';
import Branch from '../models/Branch.js';
import { householdProducts } from './householdProductsData.js';

const jamshedpurHomeServices = [
  {
    title: 'Ceiling Fan Repair & Capacitor Replacement',
    category: 'Fan Repair',
    description: 'Diagnosis of slow speed ceiling fan, hum noise, bearing replacement and original capacitor fitting in Chhota Govindpur.',
    estimatedDuration: '45 Mins',
    estimatedPrice: 299,
    imageUrl: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Ceiling Fan Hook Assembly & Installation',
    category: 'Fan Installation',
    description: 'Safe ceiling hook mounting, down-rod assembly, speed regulator connection and balancing test.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 350,
    imageUrl: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'LED Batten & Tube Light Installation',
    category: 'Tube Light Installation',
    description: 'Wall drilling, plastic rawl plug fitting, 20W LED batten installation and wiring connection.',
    estimatedDuration: '30 Mins',
    estimatedPrice: 199,
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Decorative LED Panel & False Ceiling Lighting',
    category: 'LED Light Installation',
    description: 'Concealed LED panel driver connection, strip light fitting and warm white ambient lighting setup.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 399,
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Switch Repair & Sparking Contact Fix',
    category: 'Switch Repair',
    description: 'Fixing loose contact sparking switches, burnt terminal replacement and board wiring check.',
    estimatedDuration: '30 Mins',
    estimatedPrice: 149,
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Heavy Duty 16A Power Socket Installation for Geyser / AC',
    category: 'Socket Repair',
    description: 'Heavy duty 16A modular socket point wiring with heavy gauge copper wire for high-load appliances.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 399,
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Single Pole MCB Replacement & DB Box Breaker Trip Fix',
    category: 'MCB Replacement',
    description: 'Replacing faulty tripping MCB breakers with Havells/Anchor C-Curve breakers for short-circuit safety.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 449,
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Complete House Wiring Repair & Short Circuit Tracing',
    category: 'House Wiring Repair',
    description: 'Emergency short circuit tracing, burnt neutral wire replacement and earth leakage troubleshooting in Jamshedpur.',
    estimatedDuration: '2-4 Hours',
    estimatedPrice: 999,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Door Bell Push Switch & Musical Chime Installation',
    category: 'Door Bell Installation',
    description: 'Fitting external bell push button, bell transformer wiring and interior chime mounting.',
    estimatedDuration: '30 Mins',
    estimatedPrice: 199,
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Domestic Water Pump Motor Winding & Seal Repair',
    category: 'Water Pump Repair',
    description: '0.5 HP / 1.0 HP monoblock water pump motor winding, mechanical seal & capacitor replacement.',
    estimatedDuration: '3 Hours',
    estimatedPrice: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Water Heater Geyser Element & Thermostat Replacement',
    category: 'Geyser Repair',
    description: 'Storage geyser tank descaling, replacing burnt 2000W heating element and safety thermostat.',
    estimatedDuration: '2 Hours',
    estimatedPrice: 799,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Exhaust Fan Installation & Wall Fitting',
    category: 'Exhaust Fan Repair',
    description: 'Kitchen and bathroom exhaust fan mounting with back shutter fitting and wall hole sealing.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 399,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Air Cooler Motor & Submersible Pump Repair',
    category: 'Cooler Repair',
    description: 'Desert cooler fan motor rewinding, water pump replacement and 3-speed switch wiring.',
    estimatedDuration: '2 Hours',
    estimatedPrice: 599,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Mixer Grinder Coupler & Motor Carbon Brush Fix',
    category: 'Mixer Grinder Repair',
    description: 'Fixing jar coupler slip, replacing worn motor carbon brushes and speed selector switch.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 299,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Electric Iron Thermostat & Power Cord Replacement',
    category: 'Iron Repair',
    description: 'Dry or steam iron thermal fuse replacement, thermostat recalibration and new heavy-duty power cord.',
    estimatedDuration: '45 Mins',
    estimatedPrice: 249,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Electric Kettle Auto Shut-Off Thermostat Repair',
    category: 'Electric Kettle Repair',
    description: 'Replacing faulty base connector, boiling sensor thermostat and indicator light.',
    estimatedDuration: '30 Mins',
    estimatedPrice: 199,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Emergency 24/7 Power Breakdown Visit (Chhota Govindpur)',
    category: 'Emergency Electrical Visit',
    description: 'Rapid emergency visit for sudden total power outage, burning smell or main line spark in homes.',
    estimatedDuration: '45 Mins',
    estimatedPrice: 499,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Complete Home Electrical Safety Inspection',
    category: 'Home Electrical Inspection',
    description: 'Comprehensive health check of main DB box, earthing resistance, sockets, and heavy appliance wiring.',
    estimatedDuration: '1.5 Hours',
    estimatedPrice: 599,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
  }
];

const seedData = async () => {
  try {
    // Seed Users if empty
    await User.deleteMany();
    await User.create([
      {
        name: 'Uday Kiran (Shop Owner & Admin)',
        email: 'admin@udayelectrical.com',
        password: 'adminpassword123',
        role: 'Admin',
        phone: '+91 7903789402',
        address: 'Chhota Govindpur, Jamshedpur, Jharkhand - 831015'
      },
      {
        name: 'Rajesh Sharma (Store Billing Executive)',
        email: 'staff@udayelectrical.com',
        password: 'staffpassword123',
        role: 'Staff',
        phone: '+91 9934187847',
        address: 'Govindpur Main Market, Jamshedpur'
      },

      // REAL LOCAL TECHNICIANS (Jamshedpur Roster)
      {
        name: 'Prabhat (Senior Electrician)',
        email: 'prabhat@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '7470508176',
        address: 'Chhota Govindpur, Jamshedpur'
      },
      {
        name: 'Chandan (Lead Appliance Technician)',
        email: 'chandan@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '7209455250',
        address: 'Telco Colony, Jamshedpur'
      },
      {
        name: 'Devnath (Wireman)',
        email: 'devnath@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '9934187847',
        address: 'Baridih, Jamshedpur'
      },
      {
        name: 'Appu (Senior Technician)',
        email: 'appu@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '7903789402',
        address: 'Govindpur Housing Colony, Jamshedpur'
      },
      {
        name: 'Dhruv (Electrician)',
        email: 'dhruv@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '7903789403',
        address: 'Sidhgora, Jamshedpur'
      },
      {
        name: 'Amit (Appliance Repair Spec.)',
        email: 'amit@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '7903789404',
        address: 'Golmuri, Jamshedpur'
      },
      {
        name: 'Sadhu (Junior Wireman)',
        email: 'sadhu@udayelectrical.com',
        password: 'techpassword123',
        role: 'Technician',
        phone: '7903789405',
        address: 'Birsanagar, Jamshedpur'
      },

      // Demo Customer
      {
        name: 'Ramesh Singh (Customer)',
        email: 'customer@jamshedpur.com',
        password: 'customerpassword123',
        role: 'Customer',
        phone: '+91 98351 00000',
        address: 'Govindpur Housing Colony, Jamshedpur'
      }
    ]);
    console.log('✅ Real Jamshedpur Store Users & Technician Roster Seeded (Prabhat, Chandan, Devnath, Appu, Dhruv, Amit, Sadhu)');

    // Seed Real Indian Household Products
    await Product.deleteMany();
    await Product.insertMany(householdProducts);
    console.log(`✅ Seeded ${householdProducts.length} Real Indian Household Products`);

    // Seed Real Home Repair Services
    await Service.deleteMany();
    await Service.insertMany(jamshedpurHomeServices);
    console.log(`✅ Seeded ${jamshedpurHomeServices.length} Real Home Electrical Repair Services`);

    // Seed Warehouses & Branches
    await Warehouse.deleteMany();
    await Warehouse.create([
      { name: 'Chhota Govindpur Central Electrical Shop', code: 'WH-JSR-01', location: 'Chhota Govindpur, Jamshedpur, Jharkhand - 831015', capacity: 2500 }
    ]);

    await Branch.deleteMany();
    await Branch.create([
      { name: 'Uday Electrical Works - Main Shop', code: 'BR-JSR-01', address: 'Chhota Govindpur, Jamshedpur, Jharkhand - 831015', phone: '7903789402' }
    ]);

  } catch (error) {
    console.error('Seed Data Error:', error.message);
  }
};

export default seedData;
