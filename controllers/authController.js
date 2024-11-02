const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Signup
exports.signup = async (req, res) => {
    const { username, password, name } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, name });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ token, apiKeys: user.apiKeys });
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Create API Key
exports.createApiKey = async (req, res) => {
    const userId = req.user.id;
    const apiKey = uuidv4();

    try {
        await User.findByIdAndUpdate(userId, { $push: { apiKeys: { key: apiKey } } });
        res.json({ apiKey, message: 'API key created successfully' });
    } catch (error) {
        console.error('Error creating API key:', error);
        res.status(500).json({ error: 'Error creating API key' });
    }
};

// Delete API Key
exports.deleteApiKey = async (req, res) => {
    const userId = req.user.id;
    const apiKey = req.params.key;

    try {
        await User.findByIdAndUpdate(userId, { $pull: { apiKeys: { key: apiKey } } });
        res.json({ message: 'API key deleted successfully' });
    } catch (error) {
        console.error('Error deleting API key:', error);
        res.status(500).json({ error: 'Error deleting API key' });
    }
};

// Get all API Keys
exports.getApiKeys = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.apiKeys);
    } catch (error) {
        console.error('Error fetching API keys:', error);
        res.status(500).json({ error: 'Error fetching API keys' });
    }
};
