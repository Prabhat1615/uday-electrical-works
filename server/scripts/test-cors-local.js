import http from 'http';
import app from '../app.js';
import { getAllowedOrigins, normalizeOrigin } from '../config/cors.js';

console.log('--- 1. TESTING CORS CONFIG & ORIGIN NORMALIZATION ---');
console.log('normalizeOrigin("https://uday-electrical-customer.vercel.app/"):', normalizeOrigin('https://uday-electrical-customer.vercel.app/'));
console.log('getAllowedOrigins():', getAllowedOrigins());

console.log('\n--- 2. STARTING LOCAL APP SERVER FOR HTTP OPTIONS PREFLIGHT TEST ---');

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
    { origin: 'https://uday-electrical-customer.vercel.app/', expectedSuccess: true }, // trailing slash in header
    { origin: 'https://unauthorized-domain.com', expectedSuccess: false }
  ];

  const endpointsToTest = [
    '/auth/register',
    '/api/auth/register',
    '/api/health'
  ];

  let totalFailed = 0;

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
    console.log('\nLocal CORS test completed. Total failed:', totalFailed);
    if (totalFailed === 0) {
      console.log('🎉 ALL LOCAL CORS TESTS PASSED SUCCESSFULLY!');
    }
    process.exit(totalFailed === 0 ? 0 : 1);
  });
});
