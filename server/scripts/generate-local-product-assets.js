import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

const targetDirs = [
  path.join(rootDir, 'customer-web/public/products'),
  path.join(rootDir, 'management-web/public/products'),
  path.join(rootDir, 'technician-web/public/products'),
  path.join(rootDir, 'server/uploads/products')
];

// Helper to ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const brandColors = {
  havells: { primary: '#E31E24', accent: '#000000', label: 'HAVELLS' },
  philips: { primary: '#0B5EA8', accent: '#0B5EA8', label: 'PHILIPS' },
  crompton: { primary: '#005CA9', accent: '#003366', label: 'CROMPTON' },
  polycab: { primary: '#E30613', accent: '#111111', label: 'POLYCAB' },
  wipro: { primary: '#003087', accent: '#003087', label: 'WIPRO' },
  anchor: { primary: '#004098', accent: '#022B68', label: 'ANCHOR' }
};

const createSvgGraphic = ({ name, brandKey, category, details, sku }) => {
  const brand = brandColors[brandKey] || { primary: '#0A1128', accent: '#F59E0B', label: brandKey.toUpperCase() };

  // Category specific SVG artwork
  let art = '';

  if (category === 'Ceiling Fans') {
    art = `
      <!-- Ceiling Fan Base & Rod -->
      <rect x="385" y="60" width="30" height="120" rx="4" fill="url(#metallic)" />
      <path d="M 360,180 Q 400,160 440,180 L 450,220 Q 400,240 350,220 Z" fill="${brand.primary}" />
      
      <!-- Central Motor Housing -->
      <circle cx="400" cy="270" r="85" fill="url(#motorGradient)" stroke="${brand.accent}" stroke-width="4" />
      <circle cx="400" cy="270" r="45" fill="${brand.primary}" />
      <circle cx="400" cy="270" r="15" fill="#FFFFFF" opacity="0.9" />

      <!-- Fan Blades (3-Blade Aerodynamic Configuration) -->
      <g opacity="0.95">
        <!-- Top Right Blade -->
        <path d="M 460,240 L 730,110 Q 770,90 750,140 L 510,290 Z" fill="url(#bladeGradient)" stroke="#CBD5E1" stroke-width="2" />
        <!-- Top Left Blade -->
        <path d="M 340,240 L 70,110 Q 30,90 50,140 L 290,290 Z" fill="url(#bladeGradient)" stroke="#CBD5E1" stroke-width="2" />
        <!-- Bottom Blade -->
        <path d="M 380,350 L 350,710 Q 400,750 450,710 L 420,350 Z" fill="url(#bladeGradient)" stroke="#CBD5E1" stroke-width="2" />
      </g>
    `;
  } else if (category === 'Exhaust Fans') {
    art = `
      <!-- Outer Square Vent Frame -->
      <rect x="150" y="150" width="500" height="500" rx="36" fill="#F8FAFC" stroke="${brand.primary}" stroke-width="12" />
      <!-- Circular Grill -->
      <circle cx="400" cy="400" r="210" fill="#0F172A" stroke="#334155" stroke-width="6" />
      <circle cx="400" cy="400" r="180" fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="8 8" />
      
      <!-- Fan Blades -->
      <g transform="rotate(25 400 400)">
        <path d="M 400,400 Q 480,260 400,200 Q 320,260 400,400 Z" fill="${brand.primary}" opacity="0.9" />
        <path d="M 400,400 Q 540,480 600,400 Q 540,320 400,400 Z" fill="${brand.primary}" opacity="0.9" />
        <path d="M 400,400 Q 480,540 400,600 Q 320,540 400,400 Z" fill="${brand.primary}" opacity="0.9" />
        <path d="M 400,400 Q 260,480 200,400 Q 260,320 400,400 Z" fill="${brand.primary}" opacity="0.9" />
      </g>
      <circle cx="400" cy="400" r="45" fill="url(#motorGradient)" stroke="#FFFFFF" stroke-width="4" />
    `;
  } else if (category === 'LED Bulbs') {
    art = `
      <!-- Bulb B22 Base Cap -->
      <rect x="340" y="550" width="120" height="80" rx="8" fill="url(#metallic)" stroke="#64748B" stroke-width="4" />
      <rect x="360" y="630" width="80" height="30" rx="4" fill="#475569" />
      <circle cx="330" cy="590" r="10" fill="#94A3B8" />
      <circle cx="470" cy="590" r="10" fill="#94A3B8" />

      <!-- Heat Sink Base Body -->
      <path d="M 280,420 L 340,550 L 460,550 L 520,420 Z" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="4" />

      <!-- Diffuser Dome (Glowing LED Globe) -->
      <path d="M 250,420 C 210,250 300,120 400,120 C 500,120 590,250 550,420 Z" fill="url(#bulbGlow)" stroke="${brand.primary}" stroke-width="8" />

      <!-- Wattage Spec Stamp -->
      <rect x="330" y="300" width="140" height="45" rx="10" fill="rgba(15, 23, 42, 0.06)" />
      <text x="400" y="332" font-family="Montserrat, sans-serif" font-weight="900" font-size="24" fill="${brand.primary}" text-anchor="middle">${details.watt || 'LED'}</text>
    `;
  } else if (category === 'LED Battens') {
    art = `
      <!-- Linear LED Tube Body -->
      <rect x="80" y="340" width="640" height="120" rx="20" fill="url(#battenGlow)" stroke="${brand.primary}" stroke-width="8" />
      
      <!-- End Caps -->
      <rect x="60" y="330" width="50" height="140" rx="10" fill="url(#metallic)" stroke="#64748B" stroke-width="4" />
      <rect x="690" y="330" width="50" height="140" rx="10" fill="url(#metallic)" stroke="#64748B" stroke-width="4" />

      <!-- Internal Diffuser Line -->
      <line x1="120" y1="400" x2="680" y2="400" stroke="#38BDF8" stroke-width="8" stroke-linecap="round" opacity="0.8" />
      <text x="400" y="410" font-family="Montserrat, sans-serif" font-weight="900" font-size="28" fill="${brand.primary}" text-anchor="middle" letter-spacing="2">${details.watt || '20W LED BATTEN'}</text>
    `;
  } else if (category === 'Switches') {
    art = `
      <!-- Modular Plate Surround -->
      <rect x="180" y="160" width="440" height="480" rx="32" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="12" />
      <rect x="210" y="190" width="380" height="420" rx="20" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="4" />

      <!-- Switch Rocker Mechanism -->
      <rect x="280" y="250" width="240" height="300" rx="16" fill="url(#metallic)" stroke="${brand.primary}" stroke-width="6" />
      <!-- Rocker Split Line -->
      <line x1="280" y1="400" x2="520" y2="400" stroke="#94A3B8" stroke-width="4" />
      <!-- Indicator Dot -->
      <circle cx="400" cy="320" r="12" fill="${brand.primary}" />
      <text x="400" y="470" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#475569" text-anchor="middle">${details.type || '10AX SWITCH'}</text>
    `;
  } else if (category === 'Sockets') {
    art = `
      <!-- Modular Plate Surround -->
      <rect x="180" y="160" width="440" height="480" rx="32" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="12" />
      <rect x="210" y="190" width="380" height="420" rx="20" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="4" />

      <!-- Socket Face Cavity -->
      <circle cx="400" cy="400" r="150" fill="#0F172A" stroke="${brand.primary}" stroke-width="8" />

      <!-- 3-Pin Receptacle Holes -->
      <!-- Earth Hole (Top Large) -->
      <circle cx="400" cy="310" r="28" fill="#F8FAFC" stroke="#64748B" stroke-width="6" />
      <!-- Live Hole (Bottom Right) -->
      <circle cx="470" cy="430" r="22" fill="#F8FAFC" stroke="#64748B" stroke-width="6" />
      <!-- Neutral Hole (Bottom Left) -->
      <circle cx="330" cy="430" r="22" fill="#F8FAFC" stroke="#64748B" stroke-width="6" />

      <!-- Safety Shutter Graphic -->
      <rect x="310" y="380" width="180" height="15" rx="4" fill="${brand.primary}" opacity="0.8" />
    `;
  } else {
    // Modular Accessories / Combination Plate
    art = `
      <!-- Multi-Module Plate Frame -->
      <rect x="100" y="200" width="600" height="400" rx="32" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="12" />
      <rect x="130" y="230" width="540" height="340" rx="20" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="4" />

      <!-- Switch Module (Left) -->
      <rect x="180" y="280" width="180" height="240" rx="16" fill="url(#metallic)" stroke="${brand.primary}" stroke-width="6" />
      <circle cx="270" cy="340" r="10" fill="${brand.primary}" />

      <!-- Socket Module (Right) -->
      <circle cx="510" cy="400" r="90" fill="#0F172A" stroke="${brand.primary}" stroke-width="6" />
      <circle cx="510" cy="350" r="18" fill="#FFFFFF" />
      <circle cx="550" cy="420" r="14" fill="#FFFFFF" />
      <circle cx="470" cy="420" r="14" fill="#FFFFFF" />
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    
    <!-- Metallic Shimmer -->
    <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <!-- Motor Metallic Gradient -->
    <radialGradient id="motorGradient" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="70%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </radialGradient>

    <!-- Blade Aerodynamic Gradient -->
    <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>

    <!-- Bulb Glow Light -->
    <radialGradient id="bulbGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#FDE047" />
    </radialGradient>

    <!-- Batten Glow Light -->
    <linearGradient id="battenGlow" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#E0F2FE" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E0F2FE" />
    </linearGradient>

    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- Clean Surface Card Canvas -->
  <rect width="800" height="800" fill="url(#bgGrad)" />
  <rect x="40" y="40" width="720" height="720" rx="36" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="4" filter="url(#dropShadow)" />

  <!-- Manufacturer Brand Tag Header -->
  <rect x="70" y="70" width="220" height="54" rx="16" fill="${brand.primary}" />
  <text x="180" y="105" font-family="Montserrat, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${brand.label}</text>

  <!-- Verified Genuine Electrical Emblem -->
  <g transform="translate(620, 70)">
    <rect width="110" height="38" rx="12" fill="#10B981" opacity="0.15" />
    <text x="55" y="24" font-family="Inter, sans-serif" font-weight="800" font-size="12" fill="#059669" text-anchor="middle">VERIFIED</text>
  </g>

  <!-- Main Technical Product Artwork -->
  <g transform="translate(0, 30)">
    ${art}
  </g>

  <!-- Footer Product Model Banner -->
  <rect x="70" y="690" width="660" height="54" rx="16" fill="#0F172A" opacity="0.95" />
  <text x="400" y="725" font-family="Montserrat, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF" text-anchor="middle">${name}</text>
</svg>`;
};

// Catalog mappings for generation
const catalogItems = [
  { name: 'Havells Utsav Ceiling Fan 1200mm', brandKey: 'havells', category: 'Ceiling Fans', details: {}, file: 'havells/havells-utsav-ceiling-fan-1200mm.svg' },
  { name: 'Crompton Energion Caelum BLDC Ceiling Fan 1200mm', brandKey: 'crompton', category: 'Ceiling Fans', details: {}, file: 'crompton/crompton-energion-caelum-bldc-fan.svg' },
  { name: 'Polycab Silencio Mini BLDC Ceiling Fan 1200mm', brandKey: 'polycab', category: 'Ceiling Fans', details: {}, file: 'polycab/polycab-silencio-mini-bldc-fan.svg' },
  { name: 'Havells Ventilair DX Exhaust Fan 200mm', brandKey: 'havells', category: 'Exhaust Fans', details: {}, file: 'havells/havells-ventilair-dx-exhaust-fan-200mm.svg' },
  { name: 'Crompton Brisk Air Exhaust Fan 150mm', brandKey: 'crompton', category: 'Exhaust Fans', details: {}, file: 'crompton/crompton-brisk-air-exhaust-fan-150mm.svg' },
  { name: 'Philips LED Bulb 9W B22 Cool Daylight', brandKey: 'philips', category: 'LED Bulbs', details: { watt: '9W' }, file: 'philips/philips-led-bulb-9w-b22.svg' },
  { name: 'Philips LED Bulb 12W B22 Warm White', brandKey: 'philips', category: 'LED Bulbs', details: { watt: '12W' }, file: 'philips/philips-led-bulb-12w-b22.svg' },
  { name: 'Philips LED Bulb 20W B22 Cool White', brandKey: 'philips', category: 'LED Bulbs', details: { watt: '20W' }, file: 'philips/philips-led-bulb-20w-b22.svg' },
  { name: 'Philips LED Bulb 30W B22 Neutral White', brandKey: 'philips', category: 'LED Bulbs', details: { watt: '30W' }, file: 'philips/philips-led-bulb-30w-b22.svg' },
  { name: 'Philips LED Bulb 40W B22 Cool Daylight', brandKey: 'philips', category: 'LED Bulbs', details: { watt: '40W' }, file: 'philips/philips-led-bulb-40w-b22.svg' },
  { name: 'Havells LED Bulb 9W B22 Cool White', brandKey: 'havells', category: 'LED Bulbs', details: { watt: '9W' }, file: 'havells/havells-led-bulb-9w-b22.svg' },
  { name: 'Havells LED Bulb 12W B22 Warm White', brandKey: 'havells', category: 'LED Bulbs', details: { watt: '12W' }, file: 'havells/havells-led-bulb-12w-b22.svg' },
  { name: 'Philips MASTER LED Tube T8 4 Feet 16.5W', brandKey: 'philips', category: 'LED Battens', details: { watt: '16.5W T8' }, file: 'philips/philips-master-led-tube-t8.svg' },
  { name: 'Havells LED Batten 20W 4 Feet Cool White', brandKey: 'havells', category: 'LED Battens', details: { watt: '20W BATTEN' }, file: 'havells/havells-led-batten-20w.svg' },
  { name: 'Wipro Garnet LED Batten 20W 4 Feet Natural White', brandKey: 'wipro', category: 'LED Battens', details: { watt: '20W GARNET' }, file: 'wipro/wipro-garnet-led-batten-20w.svg' },
  { name: 'Philips LED Batten 18W 4 Feet Cool Daylight', brandKey: 'philips', category: 'LED Battens', details: { watt: '18W BATTEN' }, file: 'philips/philips-led-batten-18w.svg' },
  { name: 'Havells Murano 10AX 2-Way Modular Switch', brandKey: 'havells', category: 'Switches', details: { type: '10AX 2-WAY' }, file: 'havells/havells-murano-10ax-2way-switch.svg' },
  { name: 'Anchor by Panasonic Penta Modular 1-Way Switch', brandKey: 'anchor', category: 'Switches', details: { type: '10AX 1-WAY' }, file: 'anchor/anchor-penta-modular-1way-switch.svg' },
  { name: 'Polycab Modular Switch 10AX 2-Way', brandKey: 'polycab', category: 'Switches', details: { type: '10AX 2-WAY' }, file: 'polycab/polycab-modular-switch-10ax-2way.svg' },
  { name: 'Havells Signia 10AX 1-Way Modular Switch', brandKey: 'havells', category: 'Switches', details: { type: '10AX 1-WAY' }, file: 'havells/havells-signia-10ax-1way-switch.svg' },
  { name: 'Havells 6A 3-Pin Shuttered Socket', brandKey: 'havells', category: 'Sockets', details: {}, file: 'havells/havells-6a-3pin-socket.svg' },
  { name: 'Havells 16A Heavy Duty Socket', brandKey: 'havells', category: 'Sockets', details: {}, file: 'havells/havells-16a-heavyduty-socket.svg' },
  { name: 'Anchor by Panasonic 6A 3-Pin Socket', brandKey: 'anchor', category: 'Sockets', details: {}, file: 'anchor/anchor-6a-3pin-socket.svg' },
  { name: 'Anchor by Panasonic 16A 3-Pin Socket', brandKey: 'anchor', category: 'Sockets', details: {}, file: 'anchor/anchor-16a-heavyduty-socket.svg' },
  { name: 'Havells 6M Modular Plate with Switch and Socket Combination', brandKey: 'havells', category: 'Modular Accessories', details: {}, file: 'havells/havells-6m-modular-plate.svg' },
  { name: 'Anchor by Panasonic 4M Modular Plate', brandKey: 'anchor', category: 'Modular Accessories', details: {}, file: 'anchor/anchor-4m-modular-plate.svg' }
];

console.log('⚡ Generating local static product assets across all 4 directories...');

catalogItems.forEach((item) => {
  const svgContent = createSvgGraphic(item);
  targetDirs.forEach((targetBase) => {
    const fullPath = path.join(targetBase, item.file);
    ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, svgContent, 'utf8');
  });
});

console.log(`✅ Generated ${catalogItems.length} local vector product assets across:`);
targetDirs.forEach((d) => console.log(`   📁 ${d}`));
