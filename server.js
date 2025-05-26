const express = require('express');
const cors = require('cors'); // ✅ Import CORS

const app = express();

// ✅ Allow CORS for your frontend origin
const allowedOrigins = [
  'http://localhost:3000',                 // local dev
  'https://cloudbox-frontend.vercel.app'   // deployed frontend URL (update this if yours differs)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json()); // to parse JSON bodies

// Import routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Mount routes
app.use('/api', authRoutes);
app.use('/api', uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
