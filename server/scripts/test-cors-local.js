import http from 'http';
import app from '../app.js';
import { getAllowedOrigins, normalizeOrigin } from '../config/cors.js';

console.log('--- 1. TESTING BASE URL & SOCKET TARGET URL NORMALIZATION ---');

const getApiBaseUrl = (envApi) => {
  const rawUrl = envApi || '';
  const cleanUrl = rawUrl.trim().replace(/\/+$/, '');

  if (!cleanUrl) {
    return '/api';
  }
  if (cleanUrl.endsWith('/api')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api`;
};

const getSocketTargetUrl = (envSocket, envApi, hostname = 'customer.vercel.app') => {
  if (envSocket) {
    return envSocket.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }
  if (envApi) {
    const cleanApi = envApi.trim().replace(/\/+$/, '');
    return cleanApi.replace(/\/api$/, '');
  }
  if (hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://uday-electrical-works.onrender.com';
};

const testCases = [
  { envApi: 'https://uday-electrical-works.onrender.com', expectedApi: 'https://uday-electrical-works.onrender.com/api', expectedSocket: 'https://uday-electrical-works.onrender.com' },
  { envApi: 'https://uday-electrical-works.onrender.com/api', expectedApi: 'https://uday-electrical-works.onrender.com/api', expectedSocket: 'https://uday-electrical-works.onrender.com' },
  { envApi: 'https://uday-electrical-works.onrender.com/', expectedApi: 'https://uday-electrical-works.onrender.com/api', expectedSocket: 'https://uday-electrical-works.onrender.com' },
  { envApi: 'http://localhost:5000', expectedApi: 'http://localhost:5000/api', expectedSocket: 'http://localhost:5000' },
  { envApi: '', expectedApi: '/api', expectedSocket: 'https://uday-electrical-works.onrender.com' }
];

let unitTestsFailed = 0;

for (const { envApi, expectedApi, expectedSocket } of testCases) {
  const actualApi = getApiBaseUrl(envApi);
  const actualSocket = getSocketTargetUrl(null, envApi);

  const apiPass = actualApi === expectedApi;
  const socketPass = actualSocket === expectedSocket;

  if (apiPass && socketPass) {
    console.log(`  ✅ [PASS] VITE_API_URL="${envApi}" -> API: ${actualApi}, Socket: ${actualSocket}`);
  } else {
    console.error(`  ❌ [FAIL] VITE_API_URL="${envApi}" -> API: ${actualApi} (exp: ${expectedApi}), Socket: ${actualSocket} (exp: ${expectedSocket})`);
    unitTestsFailed++;
  }
}

console.log('\n--- 2. STARTING LOCAL APP SERVER FOR HTTP OPTIONS & ROUTE PREFLIGHT TEST ---');

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Local test server running on port ${port}`);

  const originsToTest = [
    { origin: 'http://localhost:5173', expectedSuccess: true },
    { origin: 'http://localhost:5174', expectedSuccess: true },
    { origin: 'http://localhost:5175', expectedSuccess: true },
    { origin: 'https://uday-electrical-customer.vercel.app', expectedSuccess: true },
    { origin: 'https://uday-electrical-management.vercel.app', expectedSuccess: true },
    { origin: 'https://uday-electrical-technician.vercel.app', expectedSuccess: true },
    { origin: 'https://unauthorized-domain.com', expectedSuccess: false }
  ];

  const endpointsToTest = [
    '/api/auth/register',
    '/api/notifications',
    '/api/bookings',
    '/api/invoices',
    '/api/sales',
    '/api/health'
  ];

  let totalFailed = unitTestsFailed;

  for (const endpoint of endpointsToTest) {
    console.log(`\nTesting preflight OPTIONS for endpoint: ${endpoint}`);
    for (const { origin, expectedSuccess } of originsToTest) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}${endpoint}`, {
          method: 'OPTIONS',
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
          }
        });

        const allowOriginHeader = res.headers.get('access-control-allow-origin');
        const allowCredentialsHeader = res.headers.get('access-control-allow-credentials');

        if (expectedSuccess) {
          const pass = res.status === 200 &&
            allowOriginHeader === origin &&
            allowCredentialsHeader === 'true';

          if (pass) {
            console.log(`  ✅ [PASS] ${origin} -> Status: ${res.status}, Allow-Origin: ${allowOriginHeader}, Allow-Credentials: ${allowCredentialsHeader}`);
          } else {
            console.error(`  ❌ [FAIL] ${origin} -> Status: ${res.status}, Allow-Origin: ${allowOriginHeader}, Allow-Credentials: ${allowCredentialsHeader}`);
            totalFailed++;
          }
        } else {
          const pass = allowOriginHeader === null;
          if (pass) {
            console.log(`  ✅ [PASS - REJECTED AS EXPECTED] ${origin} -> No Access-Control-Allow-Origin header set.`);
          } else {
            console.error(`  ❌ [FAIL - SHOULD HAVE BEEN BLOCKED] ${origin} -> Allow-Origin: ${allowOriginHeader}`);
            totalFailed++;
          }
        }
      } catch (err) {
        console.error(`  ❌ Error testing ${origin}:`, err.message);
        totalFailed++;
      }
    }
  }

  server.close(() => {
    console.log('\nAll tests completed. Total failed:', totalFailed);
    if (totalFailed === 0) {
      console.log('🎉 ALL INTEGRATION & ROUTE VERIFICATION TESTS PASSED SUCCESSFULLY!');
    }
    process.exit(totalFailed === 0 ? 0 : 1);
  });
});
