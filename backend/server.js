require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/IncomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

//middlewares to handle cors - PERMISSIVE FOR DEBUGGING
app.use(
    cors({
        origin: true, // Allow all origins for debugging
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With", "Access-Control-Allow-Origin"],
        credentials: true,
        optionsSuccessStatus: 200
    })
);

// Additional CORS headers for debugging
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Test route to verify server is working
app.get('/', (req, res) => {
    res.json({ 
        message: 'Expense Tracker Backend API is running!', 
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        database: 'connected to MongoDB',
        port: process.env.PORT || 8000
    });
});

// Connect to MongoDB - Required!
connectDB().catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️ Server will continue without database (limited functionality)');
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);



//server upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//server public folder for test files
app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Test your API at: http://localhost:${PORT}`);
    console.log(`🏥 Health check at: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Ready to process requests!`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.error(`🚫 Port ${PORT} is already in use. Try a different port.`);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error('Stack:', err.stack);
    // Don't exit the process for uncaught exceptions in development
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process for unhandled rejections in development
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

// Keep the process alive
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated');
    });
});