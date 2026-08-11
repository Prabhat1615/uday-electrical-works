import { Server } from 'socket.io';
import { getAllowedOrigins, normalizeOrigin } from '../config/cors.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      // Same strict origin policy as the Express CORS config. Disallowed
      // origins are rejected at the handshake (HTTP 403) — never use "*"
      // with authenticated/credentialed sockets.
      origin: (origin, callback) => {
        // Allow non-browser clients (mobile apps, servers) and same-origin calls
        if (!origin) {
          return callback(null, true);
        }
        const normalizedOrigin = normalizeOrigin(origin);
        if (getAllowedOrigins().includes(normalizedOrigin)) {
          return callback(null, true);
        }
        return callback(new Error('Origin not allowed by Socket.IO CORS policy'));
      },
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket client connected: ${socket.id}`);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('send_chat_message', (data) => {
      io.emit('receive_chat_message', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    // Return dummy emitter fallback if socket server isn't bound yet
    return {
      emit: () => {},
      to: () => ({ emit: () => {} })
    };
  }
  return io;
};
