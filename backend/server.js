const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5500', // frontend will run on 5500
  credentials: true
}));
app.use(session({
  secret: 'taskmastersecret',
  resave: false,
  saveUninitialized: true,
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taskmaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🔊 Server running on http://localhost:${PORT}`);
});
// Use routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);