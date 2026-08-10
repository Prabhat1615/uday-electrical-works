// Real Product Catalog for Uday Electrical Works
// Products sourced from official manufacturer specifications
// Stock set to 0 for catalog showcase (no fake inventory)
// Images: Using professional placeholder images that correspond to product types

export const productCatalog = [
  // ==================== CEILING FANS ====================
  {
    name: 'Havells Utsav Ceiling Fan 1200mm',
    brand: 'Havells',
    category: 'Ceiling Fans',
    description: 'High speed ceiling fan with 218 m³/min air delivery. 53W power consumption with strong copper motor.',
    sku: 'UEW-FAN-001',
    mrp: 3500,
    price: 2800,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Sweep Size': '1200 mm',
      'Air Delivery': '218 m³/min',
      'Power Consumption': '53W',
      'Speed': '380 RPM',
      'Motor': '100% Copper',
      'Blades': '3'
    },
    imageUrl: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Crompton Energion Caelum BLDC Ceiling Fan 1200mm',
    brand: 'Crompton',
    category: 'Ceiling Fans',
    description: '5-Star rated BLDC ceiling fan with 220 CMM air delivery. 28W power consumption with remote control.',
    sku: 'UEW-FAN-002',
    mrp: 6500,
    price: 5200,
    stock: 0,
    warranty: '4 Years',
    specifications: {
      'Sweep Size': '1200 mm',
      'Air Delivery': '220 CMM',
      'Power Consumption': '28W',
      'Speed': '350 RPM',
      'Motor Type': 'BLDC',
      'BEE Rating': '5 Star',
      'Control': 'Remote & Regulator Compatible'
    },
    imageUrl: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Polycab Silencio Mini BLDC Ceiling Fan 1200mm',
    brand: 'Polycab',
    category: 'Ceiling Fans',
    description: '5-Star advanced BLDC ceiling fan with 235 CMM air delivery. 35W power with RF remote control.',
    sku: 'UEW-FAN-003',
    mrp: 7200,
    price: 5800,
    stock: 0,
    warranty: '3 Years + 1 Year on Registration',
    specifications: {
      'Sweep Size': '1200 mm',
      'Air Delivery': '235 CMM',
      'Power Consumption': '35W',
      'Speed': '380 RPM',
      'Motor Type': 'BLDC',
      'BEE Rating': '5 Star',
      'Control': 'RF Remote',
      'Blade Material': 'Aluminium'
    },
    imageUrl: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Havells Ventilair DX Exhaust Fan 200mm',
    brand: 'Havells',
    category: 'Exhaust Fans',
    description: '200mm domestic exhaust fan with auto back shutter. 32W power with 520 m³/h air delivery.',
    sku: 'UEW-FAN-004',
    mrp: 2200,
    price: 1750,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Size': '200 mm (8 inch)',
      'Air Delivery': '520 m³/h',
      'Power Consumption': '32W',
      'Speed': '1350 RPM',
      'Noise Level': '45 dB',
      'Features': 'Auto Back Shutter, Detachable Oil Tray'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Crompton Brisk Air Exhaust Fan 150mm',
    brand: 'Crompton',
    category: 'Exhaust Fans',
    description: '150mm lightweight exhaust fan with rust-proof ABS plastic body and automatic back shutter.',
    sku: 'UEW-FAN-005',
    mrp: 1500,
    price: 1200,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Size': '150 mm (6 inch)',
      'Body Material': 'ABS Plastic',
      'Power Consumption': '20W',
      'Features': 'Automatic Back Shutter, Rust-proof',
      'Application': 'Kitchen, Bathroom'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
  },

  // ==================== LED BULBS ====================
  {
    name: 'Philips LED Bulb 9W B22 Cool Daylight',
    brand: 'Philips',
    category: 'LED Bulbs',
    description: '9W LED bulb with B22 base. 806 lumens brightness, 6500K cool daylight color temperature.',
    sku: 'UEW-LED-009',
    mrp: 150,
    price: 120,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '9W',
      'Base': 'B22',
      'Lumens': '806 lm',
      'Color Temperature': '6500K Cool Daylight',
      'Lifespan': '15,000 hours',
      'Beam Angle': '180°',
      'CRI': '80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Philips LED Bulb 12W B22 Warm White',
    brand: 'Philips',
    category: 'LED Bulbs',
    description: '12W LED bulb with B22 base. 1360 lumens brightness, 3000K warm white color temperature.',
    sku: 'UEW-LED-012',
    mrp: 220,
    price: 175,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '12W',
      'Base': 'B22',
      'Lumens': '1360 lm',
      'Color Temperature': '3000K Warm White',
      'Lifespan': '15,000 hours',
      'Beam Angle': '200°',
      'CRI': '80',
      'Efficacy': '113 lm/W'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Philips LED Bulb 20W B22 Cool White',
    brand: 'Philips',
    category: 'LED Bulbs',
    description: '20W LED bulb with B22 base. High brightness output for larger spaces, 6500K cool white.',
    sku: 'UEW-LED-020',
    mrp: 350,
    price: 280,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '20W',
      'Base': 'B22',
      'Color Temperature': '6500K Cool White',
      'Application': 'Large Rooms, Offices',
      'Lifespan': '15,000 hours'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Philips LED Bulb 30W B22 Neutral White',
    brand: 'Philips',
    category: 'LED Bulbs',
    description: '30W LED bulb with B22 base. High output for commercial spaces, 4000K neutral white.',
    sku: 'UEW-LED-030',
    mrp: 450,
    price: 360,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '30W',
      'Base': 'B22',
      'Color Temperature': '4000K Neutral White',
      'Application': 'Commercial, Large Spaces',
      'Lifespan': '15,000 hours'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Philips LED Bulb 40W B22 Cool Daylight',
    brand: 'Philips',
    category: 'LED Bulbs',
    description: '40W equivalent LED bulb with B22 base. Ultra bright for large areas, 6500K cool daylight.',
    sku: 'UEW-LED-040',
    mrp: 550,
    price: 440,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '40W Equivalent',
      'Base': 'B22',
      'Color Temperature': '6500K Cool Daylight',
      'Application': 'Large Rooms, Warehouses',
      'Lifespan': '15,000 hours'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Havells LED Bulb 9W B22 Cool White',
    brand: 'Havells',
    category: 'LED Bulbs',
    description: '9W LED bulb with B22 base. Energy efficient with cool white light output.',
    sku: 'UEW-LED-009-H',
    mrp: 140,
    price: 110,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '9W',
      'Base': 'B22',
      'Color Temperature': '6500K Cool White',
      'Lifespan': '15,000 hours',
      'Application': 'General Lighting'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Havells LED Bulb 12W B22 Warm White',
    brand: 'Havells',
    category: 'LED Bulbs',
    description: '12W LED bulb with B22 base. Warm white light for comfortable ambiance.',
    sku: 'UEW-LED-012-H',
    mrp: 200,
    price: 160,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Wattage': '12W',
      'Base': 'B22',
      'Color Temperature': '3000K Warm White',
      'Lifespan': '15,000 hours',
      'Application': 'Living Rooms, Bedrooms'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },

  // ==================== LED BATTENS / TUBES ====================
  {
    name: 'Philips MASTER LED Tube T8 4 Feet 16.5W',
    brand: 'Philips',
    category: 'LED Battens',
    description: '4 feet T8 LED tube with 16.5W power consumption. 2500 lumens output, 4000K neutral white.',
    sku: 'UEW-BAT-001',
    mrp: 450,
    price: 360,
    stock: 0,
    warranty: '3 Years',
    specifications: {
      'Length': '4 Feet (1200mm)',
      'Wattage': '16.5W',
      'Lumens': '2500 lm',
      'Color Temperature': '4000K Neutral White',
      'Base': 'T8 (G13)',
      'Lifespan': '50,000 hours',
      'CRI': '80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Havells LED Batten 20W 4 Feet Cool White',
    brand: 'Havells',
    category: 'LED Battens',
    description: '20W LED batten light, 4 feet length. High brightness cool white output for residential and commercial use.',
    sku: 'UEW-BAT-002',
    mrp: 480,
    price: 385,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Length': '4 Feet (1200mm)',
      'Wattage': '20W',
      'Color Temperature': '6500K Cool White',
      'Body Material': 'Polycarbonate',
      'Application': 'Home, Office, Shop'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Wipro Garnet LED Batten 20W 4 Feet Natural White',
    brand: 'Wipro',
    category: 'LED Battens',
    description: '20W Garnet LED batten, 4 feet length. 1135mm length with natural white 4000K color temperature.',
    sku: 'UEW-BAT-003',
    mrp: 420,
    price: 335,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Length': '4 Feet (1135mm)',
      'Wattage': '20W',
      'Color Temperature': '4000K Natural White',
      'Model': 'Garnet Series',
      'Standards': 'BIS Certified',
      'Application': 'Residential, Commercial'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Philips LED Batten 18W 4 Feet Cool Daylight',
    brand: 'Philips',
    category: 'LED Battens',
    description: '18W LED batten light, 4 feet length. Cool daylight output for bright illumination.',
    sku: 'UEW-BAT-004',
    mrp: 400,
    price: 320,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Length': '4 Feet (1200mm)',
      'Wattage': '18W',
      'Color Temperature': '6500K Cool Daylight',
      'Body': 'Polycarbonate Diffuser',
      'Application': 'General Lighting'
    },
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60'
  },

  // ==================== SWITCHES ====================
  {
    name: 'Havells Murano 10AX 2-Way Modular Switch',
    brand: 'Havells',
    category: 'Switches',
    description: '10AX 2-way modular switch with silent operation. Premium feel with double rocker design for safety.',
    sku: 'UEW-SW-001',
    mrp: 85,
    price: 68,
    stock: 0,
    warranty: '10 Years',
    specifications: {
      'Rating': '10AX',
      'Type': '2-Way Switch',
      'Material': 'Polycarbonate (UV Stabilized)',
      'Voltage': '240V',
      'Features': 'Silent Operation, Double Rocker Design',
      'Standards': 'IS 3854 compliant'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Anchor by Panasonic Penta Modular 1-Way Switch',
    brand: 'Anchor by Panasonic',
    category: 'Switches',
    description: 'Penta modular 1-way switch with IP20 protection. Tested for over 1 lakh operations.',
    sku: 'UEW-SW-002',
    mrp: 65,
    price: 52,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Rating': '10AX',
      'Type': '1-Way Switch',
      'Material': 'Polycarbonate',
      'Protection': 'IP20',
      'Operations': '1 Lakh+',
      'Standards': 'BIS compliant'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Polycab Modular Switch 10AX 2-Way',
    brand: 'Polycab',
    category: 'Switches',
    description: '10AX 2-way modular switch with superior conductivity brass terminals. Flame retardant material.',
    sku: 'UEW-SW-003',
    mrp: 70,
    price: 56,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Rating': '10AX',
      'Type': '2-Way Switch',
      'Material': 'Fire Retardant Polycarbonate',
      'Terminals': 'Brass Metal',
      'Features': 'Silver Plated Contacts',
      'Standards': 'IS 3854 & IS 1293'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Havells Signia 10AX 1-Way Modular Switch',
    brand: 'Havells',
    category: 'Switches',
    description: '10AX 1-way modular switch from Signia range. Soft action switches with arc shield for safety.',
    sku: 'UEW-SW-004',
    mrp: 75,
    price: 60,
    stock: 0,
    warranty: '10 Years',
    specifications: {
      'Rating': '10AX',
      'Type': '1-Way Switch',
      'Series': 'Signia',
      'Features': 'Soft Action, Arc Shield',
      'Terminals': 'Silver Plated',
      'Protection': 'IP20'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },

  // ==================== SOCKETS ====================
  {
    name: 'Havells 6A 3-Pin Shuttered Socket',
    brand: 'Havells',
    category: 'Sockets',
    description: '6A 3-pin shuttered modular socket with child safety feature. Silver plated terminals.',
    sku: 'UEW-SOC-006',
    mrp: 95,
    price: 76,
    stock: 0,
    warranty: '10 Years',
    specifications: {
      'Rating': '6A',
      'Type': '3-Pin Shuttered Socket',
      'Features': 'Child Safety Shutter',
      'Terminals': 'Silver Plated',
      'Protection': 'IP20',
      'Standards': 'IS 1293 compliant'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Havells 16A Heavy Duty Socket',
    brand: 'Havells',
    category: 'Sockets',
    description: '16A heavy duty 3-pin modular socket for high-load appliances like AC, geyser, water heater.',
    sku: 'UEW-SOC-016',
    mrp: 145,
    price: 116,
    stock: 0,
    warranty: '10 Years',
    specifications: {
      'Rating': '16A',
      'Type': '3-Pin Heavy Duty Socket',
      'Application': 'AC, Geyser, Water Heater',
      'Terminals': 'Silver Plated',
      'Features': 'High Load Capacity',
      'Standards': 'IS 1293 compliant'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Anchor by Panasonic 6A 3-Pin Socket',
    brand: 'Anchor by Panasonic',
    category: 'Sockets',
    description: '6A 3-pin modular socket with IP20 protection. Conforms to BIS standards.',
    sku: 'UEW-SOC-006-A',
    mrp: 80,
    price: 64,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Rating': '6A',
      'Type': '3-Pin Socket',
      'Protection': 'IP20',
      'Material': 'Polycarbonate',
      'Standards': 'BIS compliant',
      'Series': 'Penta Modular'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Anchor by Panasonic 16A 3-Pin Socket',
    brand: 'Anchor by Panasonic',
    category: 'Sockets',
    description: '16A 3-pin heavy duty modular socket for high power appliances. IP20 protection.',
    sku: 'UEW-SOC-016-A',
    mrp: 130,
    price: 104,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Rating': '16A',
      'Type': '3-Pin Heavy Duty Socket',
      'Application': 'High Power Appliances',
      'Protection': 'IP20',
      'Material': 'Polycarbonate',
      'Series': 'Penta Modular'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },

  // ==================== MODULAR ACCESSORIES ====================
  {
    name: 'Havells 6M Modular Plate with Switch and Socket Combination',
    brand: 'Havells',
    category: 'Modular Accessories',
    description: '6M modular plate combination with 1 switch and 1 socket. Multiple plate options available.',
    sku: 'UEW-ACC-001',
    mrp: 250,
    price: 200,
    stock: 0,
    warranty: '10 Years',
    specifications: {
      'Plate Size': '6M',
      'Configuration': '1 Switch + 1 Socket',
      'Series': 'Signia/Murano',
      'Material': 'Polycarbonate',
      'Colors': 'White, Grey, Metallic',
      'Installation': 'Front Loading'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  },
  {
    name: 'Anchor by Panasonic 4M Modular Plate',
    brand: 'Anchor by Panasonic',
    category: 'Modular Accessories',
    description: '4M modular plate for Penta series switches and sockets. Multiple configuration options.',
    sku: 'UEW-ACC-002',
    mrp: 180,
    price: 144,
    stock: 0,
    warranty: '2 Years',
    specifications: {
      'Plate Size': '4M',
      'Series': 'Penta Modular',
      'Material': 'Polycarbonate',
      'Dimensions': '156mm x 95mm',
      'Colors': 'White, Black & Silver, Black',
      'Features': 'LED Locator Option Available'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60'
  }
];
