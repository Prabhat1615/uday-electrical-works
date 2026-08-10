import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public');
mkdirSync(outDir, { recursive: true });

// Site domain is configurable via SITE_URL (used by deployment pipelines).
// Defaults to the production domain.
const SITE = (process.env.SITE_URL || 'https://www.udayelectricalworks.in').replace(/\/$/, '');
const today = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/shop', priority: 0.9, changefreq: 'daily' },
  { path: '/services', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/reviews', priority: 0.5, changefreq: 'monthly' },
  { path: '/login', priority: 0.3, changefreq: 'yearly' },
  { path: '/register', priority: 0.3, changefreq: 'yearly' }
];

const urls = routes
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(outDir, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`sitemap.xml written with ${routes.length} URLs`);
