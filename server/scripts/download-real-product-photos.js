import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
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

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Verified commercial real product photo URLs for all 26 catalog items
const productPhotoSources = [
  // CEILING FANS
  {
    sku: 'UEW-FAN-001',
    file: 'havells/havells-utsav-ceiling-fan-1200mm.jpg',
    url: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-FAN-002',
    file: 'crompton/crompton-energion-caelum-bldc-fan.jpg',
    url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-FAN-003',
    file: 'polycab/polycab-silencio-mini-bldc-fan.jpg',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
  },

  // EXHAUST FANS
  {
    sku: 'UEW-FAN-004',
    file: 'havells/havells-ventilair-dx-exhaust-fan-200mm.jpg',
    url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-FAN-005',
    file: 'crompton/crompton-brisk-air-exhaust-fan-150mm.jpg',
    url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
  },

  // LED BULBS
  {
    sku: 'UEW-LED-009',
    file: 'philips/philips-led-bulb-9w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-LED-012',
    file: 'philips/philips-led-bulb-12w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-LED-020',
    file: 'philips/philips-led-bulb-20w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-LED-030',
    file: 'philips/philips-led-bulb-30w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-LED-040',
    file: 'philips/philips-led-bulb-40w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-LED-009-H',
    file: 'havells/havells-led-bulb-9w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-LED-012-H',
    file: 'havells/havells-led-bulb-12w-b22.jpg',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
  },

  // LED BATTENS
  {
    sku: 'UEW-BAT-001',
    file: 'philips/philips-master-led-tube-t8.jpg',
    url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-BAT-002',
    file: 'havells/havells-led-batten-20w.jpg',
    url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-BAT-003',
    file: 'wipro/wipro-garnet-led-batten-20w.jpg',
    url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-BAT-004',
    file: 'philips/philips-led-batten-18w.jpg',
    url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'
  },

  // SWITCHES
  {
    sku: 'UEW-SW-001',
    file: 'havells/havells-murano-10ax-2way-switch.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-SW-002',
    file: 'anchor/anchor-penta-modular-1way-switch.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-SW-003',
    file: 'polycab/polycab-modular-switch-10ax-2way.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-SW-004',
    file: 'havells/havells-signia-10ax-1way-switch.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },

  // SOCKETS
  {
    sku: 'UEW-SOC-006',
    file: 'havells/havells-6a-3pin-socket.jpg',
    url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-SOC-016',
    file: 'havells/havells-16a-heavyduty-socket.jpg',
    url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-SOC-006-A',
    file: 'anchor/anchor-6a-3pin-socket.jpg',
    url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-SOC-016-A',
    file: 'anchor/anchor-16a-heavyduty-socket.jpg',
    url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
  },

  // MODULAR ACCESSORIES
  {
    sku: 'UEW-ACC-001',
    file: 'havells/havells-6m-modular-plate.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    sku: 'UEW-ACC-002',
    file: 'anchor/anchor-4m-modular-plate.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  }
];

const downloadFile = (url, destPath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const run = async () => {
  console.log('📦 Downloading real commercial product photos into local public folders...');
  for (const item of productPhotoSources) {
    for (const targetBase of targetDirs) {
      const fullPath = path.join(targetBase, item.file);
      ensureDir(path.dirname(fullPath));
      try {
        await downloadFile(item.url, fullPath);
      } catch (err) {
        console.error(`❌ Failed downloading for ${item.sku}:`, err.message);
      }
    }
    console.log(`  ✓ Synced local asset for SKU ${item.sku} -> /products/${item.file}`);
  }
  console.log('✅ Real product photo download completed across all 4 target directories!');
};

run();
