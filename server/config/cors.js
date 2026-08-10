import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
];

// Resolve allowed frontend origins from CLIENT_URL / CLIENT_URLS env vars.
// Multiple origins can be comma-separated, e.g.
// CLIENT_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
export const getAllowedOrigins = () => {
  const fromEnv = [
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
    ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : [])
  ]
    .map((o) => o.trim())
    .filter(Boolean);

  return fromEnv.length ? [...new Set(fromEnv)] : DEFAULT_ORIGINS;
};

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, Postman, etc.) and same-origin calls
    if (!origin || getAllowedOrigins().includes(origin)) {
      return callback(null, true);
    }
    const error = new Error('Origin not allowed by CORS policy');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};
