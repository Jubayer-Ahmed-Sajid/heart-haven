require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./app');
const { connectDatabase } = require('./config/db');
const { registerSocketHandlers } = require('./config/socket');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
  });

  registerSocketHandlers(io);

  server.listen(PORT, () => {
    console.log(`Heart-Haven API listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Heart-Haven API', error);
  process.exit(1);
});
