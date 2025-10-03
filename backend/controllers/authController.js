const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate JWT token
const generateToken = (id) => {
    // Debug: Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not defined in environment variables');
        throw new Error('JWT_SECRET configuration is missing');
    }
    
    console.log('✅ JWT_SECRET found, generating token...');
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

//REGISTER USER
exports.registerUser = async (req, res) => {
    
    try {
        // Debug: Check if req.body exists
        console.log('Request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        
        // Check if req.body is undefined or empty
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: 'Request body is empty. Please send data in JSON format with Content-Type: application/json', 
                status: 'fail' 
            });
        }

        const { fullName, email, password, profileImageUrl } = req.body;

        //validation check for missing fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields', status: 'fail' });
        }

        // Additional validation checks
        if (fullName.trim().length < 2) {
            return res.status(400).json({ message: 'Full name must be at least 2 characters long', status: 'fail' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address', status: 'fail' });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', status: 'fail' });
        }

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', status: 'fail' });
        }

        //create new user
        const newUser = await User.create({ fullName, email, password, profileImageUrl });
        res.status(201).json({
            message: 'User registered successfully',
            status: 'success',
            data: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profileImageUrl: newUser.profileImageUrl
            },
            token: generateToken(newUser._id),
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error', error: err.message, status: 'error' });
    }
};


//LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: 'Request body is empty. Please send data in JSON format with Content-Type: application/json', 
                status: 'fail' 
            });
        }

        const { email, password } = req.body;

        //validation check for missing fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password', status: 'fail' });
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password', status: 'fail' });
        }

        //check password (assuming you have a comparePassword method in User model)
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password', status: 'fail' });
        }

        res.status(200).json({
            message: 'Login successful',
            status: 'success',
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message, status: 'error' });
    }
};

//GET USER INFO
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 'fail' });
        }

        res.status(200).json({
            message: 'User info retrieved successfully',
            status: 'success',
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message, status: 'error' });
    }
};