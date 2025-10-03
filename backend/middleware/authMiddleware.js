const jwt = require('jsonwebtoken');
const User = require('../models/User');

//middleware to protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Check if authorization header exists and starts with Bearer
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, no token provided',
                status: 'fail'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, user not found',
                status: 'fail'
            });
        }
        
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({
            message: 'Not authorized, token failed',
            status: 'fail',
            error: err.message
        });
    }
};