const express = require('express');
const { registerUser, loginUser, getUserInfo } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// File upload route with better error handling
router.post("/upload-image", (req, res) => {
    // Use upload.single with error handling
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    message: 'File too large', 
                    status: 'fail' 
                });
            }
            
            if (err.message.includes('Invalid file type')) {
                return res.status(400).json({ 
                    message: 'Invalid file type. Only JPEG, PNG, and JPG are allowed.', 
                    status: 'fail' 
                });
            }
            
            if (err.code === 'UNEXPECTED_FIELD') {
                return res.status(400).json({ 
                    message: 'Unexpected field name. Use "file" as the field name in form-data.', 
                    status: 'fail',
                    hint: 'In Postman: Body > form-data > Key: "file" (set as File type)'
                });
            }
            
            return res.status(400).json({ 
                message: 'Upload failed', 
                error: err.message, 
                status: 'fail' 
            });
        }
        
        if (!req.file) {
            return res.status(400).json({ 
                message: 'No file uploaded. Please select a file.', 
                status: 'fail',
                hint: 'In Postman: Body > form-data > Key: "file" (set as File type) > Select image file'
            });
        }
        
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ 
            message: 'File uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            status: 'success'
        });
    });
});

// Alternative upload route that accepts any field name
router.post("/upload-any", upload.any(), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
            message: 'No file uploaded', 
            status: 'fail',
            hint: 'Upload a file using any field name in form-data'
        });
    }
    
    const file = req.files[0]; // Get first uploaded file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    res.status(200).json({ 
        message: 'File uploaded successfully',
        imageUrl: imageUrl,
        filename: file.filename,
        originalName: file.originalname,
        fieldName: file.fieldname,
        size: file.size,
        status: 'success'
    });
});

// Smart upload route that accepts common field names
router.post("/upload", (req, res) => {
    // Try multiple common field names
    const commonFieldNames = ['file', 'image', 'photo', 'picture', 'avatar'];
    
    let uploadHandler = null;
    
    // Try to handle any of the common field names
    upload.any()(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ 
                message: 'Upload failed', 
                error: err.message, 
                status: 'fail',
                hint: 'Use field names like: file, image, photo, picture, or avatar'
            });
        }
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                message: 'No file uploaded', 
                status: 'fail',
                hint: 'Upload a file using field names like: file, image, photo, picture, or avatar'
            });
        }
        
        const file = req.files[0]; // Get first uploaded file
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        
        res.status(200).json({ 
            message: 'File uploaded successfully',
            imageUrl: imageUrl,
            filename: file.filename,
            originalName: file.originalname,
            fieldName: file.fieldname,
            size: file.size,
            status: 'success'
        });
    });
});

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