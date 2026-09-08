const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
  // Seed default segments
  try {
    const Segment = require('./models/Segment');
    const defaultSegments = [
      { name: 'Lead', color: '#94a3b8', isDefault: true },
      { name: 'Prospect', color: '#60a5fa', isDefault: true },
      { name: 'Premium', color: '#fbbf24', isDefault: true },
      { name: 'Enterprise', color: '#c084fc', isDefault: true },
      { name: 'Returning', color: '#34d399', isDefault: true },
      { name: 'Inactive', color: '#9ca3af', isDefault: true },
      { name: 'Lost', color: '#f87171', isDefault: true }
    ];
    for (const seg of defaultSegments) {
      await Segment.updateOne({ name: seg.name }, { $set: seg }, { upsert: true });
    }
  } catch (err) {
    console.error('Failed to seed segments:', err);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

const app = express();

// Security Middleware
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Apply rate limiter to all API requests
app.use('/api', apiLimiter);

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/segments', require('./routes/segmentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date()
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Express 5 requires named wildcards — bare '*' is not supported
  app.get('/{*path}', (req, res, next) => {
    // Let unrecognized API routes fall through to the error handler (404)
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running. Please set NODE_ENV to production to serve the frontend.');
  });
}

// Error Handler
app.use(errorHandler);
