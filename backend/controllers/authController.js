const jwt = require('jsonwebtoken');

//genarate JWT token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

};
//REGISTER USER
exports.registerUser = async (req, res) => {};

//LOGIN USER

exports.loginUser = async (req, res) => {};

//GET USER INFO
exports.getUserInfo = async (req, res) => {};