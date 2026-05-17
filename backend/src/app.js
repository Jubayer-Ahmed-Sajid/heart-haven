const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { authOptional } = require('./middleware/auth');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(authOptional);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'heart-haven-api',
    modules: ['vents', 'no-contact', 'support', 'resources', 'funding'],
  });
});

app.use('/api', routes);

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || 'Internal Server Error',
  });
});

module.exports = { app };
