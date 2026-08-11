import dotenv from 'dotenv';

dotenv.config();

// Standard local development ports and production Vercel frontend origins
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'https://uday-electrical-customer.vercel.app',
  'https://uday-electrical-management.vercel.app',
  'https://uday-electrical-works-management-we.vercel.app',
  'https://uday-electrical-technician.vercel.app',
  'https://uday-electrical-technician-web.vercel.app'
];

/**
 * Normalizes an origin string by trimming whitespace and removing trailing slashes.
 */
export const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return '';
  return origin.trim().replace(/\/+$/, '');
};

// Resolve allowed frontend origins from CLIENT_URL / CLIENT_URLS env vars + DEFAULT_ORIGINS
export const getAllowedOrigins = () => {
  const envOrigins = [
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
    ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : [])
  ];

  const normalizedEnvOrigins = envOrigins
    .map(normalizeOrigin)
    .filter(Boolean);

  const normalizedDefaultOrigins = DEFAULT_ORIGINS
    .map(normalizeOrigin)
    .filter(Boolean);

  const combined = [...normalizedDefaultOrigins, ...normalizedEnvOrigins];
  return [...new Set(combined)];
};

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, Postman, server-to-server) and same-origin calls
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const allowed = getAllowedOrigins();

    if (allowed.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`[CORS] Blocked request from origin: ${origin}. Allowed origins:`, allowed);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

