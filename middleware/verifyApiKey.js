const User = require('../models/User');

exports.verifyApiKey = async (req, res, next) => {
    const apiKey = req.query.apiKey; 
    console.log('Received API key:', apiKey); 

    if (!apiKey) {
        return res.status(403).json({ error: 'API key is required' });
    }

    try {
        const user = await User.findOne({ 'apiKeys.key': apiKey });

        // Debugging: Log all users or specific keys if necessary
        const allUsers = await User.find();
        console.log('All users:', allUsers);

        if (!user) {
            console.log('Invalid API key:', apiKey);
            return res.status(403).json({ error: 'Invalid API key' });
        }

        // Optionally, attach user info to the request
        req.user = user; 
        next();
    } catch (error) {
        console.error('Error verifying API key:', error); 
        return res.status(500).json({ error: 'Error verifying API key' });
    }
};
