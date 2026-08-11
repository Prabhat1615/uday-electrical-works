import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176'
];

// Resolve allowed frontend origins from CLIENT_URL / CLIENT_URLS env vars + DEFAULT_ORIGINS
export const getAllowedOrigins = () => {
  const fromEnv = [
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
    ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : [])
  ]
    .map((o) => o.trim())
    .filter(Boolean);

  // In development, ensure local localhost ports are always allowed
  const combined = process.env.NODE_ENV === 'production' 
    ? (fromEnv.length ? fromEnv : DEFAULT_ORIGINS)
    : [...fromEnv, ...DEFAULT_ORIGINS];

  return [...new Set(combined)];
};

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, Postman, server-to-server) and valid origin calls
    const allowed = getAllowedOrigins();
    if (!origin || allowed.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked request from origin: ${origin}. Allowed origins:`, allowed);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};
