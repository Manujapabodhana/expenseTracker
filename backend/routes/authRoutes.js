const express = require('express');
const { registerUser, loginUser, getUserInfo } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// Test route to get a token quickly
router.post("/test-token", async (req, res) => {
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign({ id: "test-user-id" }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
        message: "Test token generated", 
        token: testToken,
        usage: "Use this token in Authorization header as: Bearer " + testToken
    });
});

module.exports = router;