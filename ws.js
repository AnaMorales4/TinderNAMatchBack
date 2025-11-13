const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./db');
const socketController = require('./controllers/socketController');

dotenv.config();

//Puse el puerto que tenemos en la imagen de la arquitectura jeje
const PORT = process.env.WS_PORT || 8001;

async function startWebSocket() {
  try {
    await connectDB();

    const server = http.createServer();

    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    socketController(io);

    server.listen(PORT, () => {
      console.log(`WebSocket server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting WebSocket server:', err);
    process.exit(1);
  }
}

startWebSocket();
