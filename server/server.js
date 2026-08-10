import http from 'http';
import app from './app.js';
import connectDB, { DB_NAME } from './config/db.js';
import { initSocket } from './services/socketService.js';

const PORT = process.env.PORT || 5000;

// The backend only starts accepting traffic after the database is connected.
// No automatic seeding runs on startup — development seed data is applied
// explicitly with: npm run seed:dev
const start = async () => {
  await connectDB();

  // Create HTTP Server & Initialize Socket.io (single Socket.IO server,
  // attached to the same HTTP server that listens on PORT)
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    const env = process.env.NODE_ENV || 'development';
    console.log(`=======================================================`);
    console.log(`🚀 Uday Electrical Works Engine`);
    console.log(`🌐 Environment: ${env}`);
    console.log(`🗄️  Database: ${DB_NAME}`);
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`⚡ Socket.IO initialized`);
    console.log(`🔒 Helmet Security & Rate Limiting Enforced`);
    if (env !== 'production') {
      console.log(`⚠️  Development mode: payment/email flows may be simulated.`);
    }
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Another backend process is running.`);
      console.error('   Stop the old process (e.g. an older node server.js or src/server.js) and restart.');
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });
};

start().catch((err) => {
  console.error('Fatal startup error:', err.message);
  process.exit(1);
});
