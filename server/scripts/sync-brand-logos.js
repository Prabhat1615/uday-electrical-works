import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

const sourceDir = path.join(rootDir, 'images');
const targetDirs = [
  path.join(rootDir, 'customer-web/public/brands'),
  path.join(rootDir, 'management-web/public/brands'),
  path.join(rootDir, 'technician-web/public/brands')
];

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const brandFiles = [
  'anchor.jpg',
  'bajaj.jpg',
  'cona.jpg',
  'crompton.jpg',
  'finolex.jpg',
  'girish.jpg',
  'GM.jpg',
  'haveels.jpg',
  'lefigaro.jpg',
  'orient.jpg',
  'philips.jpg',
  'polycab.jpg',
  'roxy.jpg'
];

console.log('🔄 Syncing user-provided 13 brand logo image files to public assets...');

targetDirs.forEach((targetBase) => {
  ensureDir(targetBase);
  brandFiles.forEach((file) => {
    const src = path.join(sourceDir, file);
    const dest = path.join(targetBase, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied ${file} -> ${path.relative(rootDir, dest)}`);
    } else {
      console.warn(`  ⚠️ Missing source file: ${src}`);
    }
  });
});

console.log('✅ Brand logos sync completed successfully!');
