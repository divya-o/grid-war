import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { registerSocketHandlers } from './sockets/handlers.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Real-Time Grid Server', status: 'running' });
});
//health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  registerSocketHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`[-] User disconnected: ${socket.id}`);
  });
  
});

//start 
httpServer.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`Socket.IO ready`);
});