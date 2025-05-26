const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // cloudinary config
const upload = multer({ storage });

const authenticate = require('../middleware/authMiddleware'); // authentication middleware
const { uploadFile, getUserFiles, deleteFile } = require('../controllers/uploadController'); // controller functions

// Actual routes
router.post('/file', authenticate, upload.single('file'), uploadFile);
router.get('/files', authenticate, getUserFiles);
router.delete('/file/:id', authenticate, deleteFile);

module.exports = router;
