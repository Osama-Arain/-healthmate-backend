const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Specific frontend origin (your deployed frontend)
const allowedOrigin = 'https://healthmate-frontend-omega.vercel.app';

// ✅ CORS setup
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Handle preflight (OPTIONS) requests manually (important for Vercel)
app.options('*', cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/vitals', require('./routes/vitals'));

// Health check
app.get('/api/health', (req, res) => {
  console.log('✅ /api/health endpoint was called at:', new Date().toISOString());
  res.status(200).json({
    success: true,
    message: 'HealthMate API is running! 🏥',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the HealthMate API! 🏥');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;
