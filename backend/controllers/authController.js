const User = require('../models/User');
const jwt = require('jsonwebtoken');

//genarate JWT token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

};
//REGISTER USER
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //validation check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields', status: 'fail' });
    }
    try {
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', status: 'fail' });
        }

        //careate new user
        const User = await User.create({ fullName, email, password, profileImageUrl });
        res.status(201).json({
            id: User._id,
            user,
            token: generateToken(User._id),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message, status: 'error' });

};


//LOGIN USER

exports.loginUser = async (req, res) => {};

//GET USER INFO
exports.getUserInfo = async (req, res) => {};