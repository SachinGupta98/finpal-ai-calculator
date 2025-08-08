require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// The key is securely loaded from your .env file on local, and Vercel environment variables on deployment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// The single API route your frontend will call
app.post('/api/generate', async (req, res) => {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key is not configured on the server.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: userPrompt }] }]
    };

    try {
        const response = await axios.post(apiUrl, payload);
        res.json(response.data); // Forward Google's response to the frontend
    } catch (error) {
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to contact the AI service.' });
    }
});

// Export the app for Vercel's serverless environment
module.exports = app;
