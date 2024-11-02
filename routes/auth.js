const express = require('express');
const {
    signup,
    login,
    createApiKey,
    deleteApiKey,
    getApiKeys
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/keys', authenticate, createApiKey); 
router.delete('/keys/:key', authenticate, deleteApiKey);
router.get('/keys', authenticate, getApiKeys); 

module.exports = router;
