require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const apiRoutes = require('./src/routes/api.routes');
const redirectRoutes = require('./src/routes/redirect.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit (prevents abuse)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
}));

// Static frontend
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Health check (required)
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// API routes
app.use('/api', apiRoutes);

// Stats page route — must come BEFORE redirect
app.get('/code/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'code.html'));
});

// Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Redirect route (must be LAST)
app.use('/', redirectRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, () => {
  console.log(`🚀 TinyLink running on port ${PORT}`);
});
