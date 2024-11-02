const User = require('../models/User');

exports.verifyApiKey = async (req, res, next) => {
    const apiKey = req.query.apiKey; 

    if (!apiKey) {
        return res.status(403).json({ error: 'API key is required' });
    }

    try {

        const user = await User.findOne({ 'apiKeys.key': apiKey });
        
        if (!user) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        req.user = user; 

        next();
    } catch (error) {
        console.error('Error verifying API key:', error);
        res.status(500).json({ error: 'Error verifying API key' });
    }
};
