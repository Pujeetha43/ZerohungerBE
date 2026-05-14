// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/donations', donationRoutes); // ✅ Attach donation API routes
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/admin', adminRoutes);

// Basic route to check server
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
