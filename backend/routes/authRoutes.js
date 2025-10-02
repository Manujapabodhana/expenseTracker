const express = require('express');
const { registerUser, loginUser, getUserInfo } = require('../controllers/authController');
// const { protect } = require('../middleware/auth'); // Uncomment when you create auth middleware

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/getUser", protect, getUserInfo); // Uncomment when you create auth middleware
router.get("/getUser", getUserInfo); // Temporary - remove protect middleware for now

module.exports = router;