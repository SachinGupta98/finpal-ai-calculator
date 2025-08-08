require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// The key is now securely loaded from your .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


// Middleware
app.use(cors()); // Allows your frontend to talk to this server
app.use(express.json()); // Allows the server to understand JSON

// The single API route your frontend will call
app.post('/api/generate', async (req, res) => {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
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

app.listen(PORT, () => {
    console.log(`🚀 Secure proxy server running on http://localhost:${PORT}`);
});
