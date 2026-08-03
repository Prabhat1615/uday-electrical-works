import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import seedData from './utils/seedData.js';
import { initSocket } from './services/socketService.js';

const PORT = process.env.PORT || 5000;

// Connect Database & Seed Master Data
connectDB().then(() => {
  seedData();
});

// Create HTTP Server & Initialize Socket.io
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Uday Electrical Works Enterprise ERP Engine (Phase 5)`);
  console.log(`🌐 Server running on port: http://localhost:${PORT}`);
  console.log(`⚡ WebSockets initialized with Socket.io`);
  console.log(`🔒 Helmet Security & Rate Limiting Enforced`);
  console.log(`=======================================================`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
