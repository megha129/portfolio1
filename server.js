require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    try {
        if (!process.env.WEB3FORMS_KEY) {
             console.log('Skipping email notification: WEB3FORMS_KEY not set.');
             return res.status(500).json({ error: 'Email configuration is missing on the server.' });
        }

        // Send Email Notification securely over HTTPS bypassing Google's strict SMTP firewall
        const apiResponse = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_KEY,
                subject: `New Portfolio Message from ${name}: ${subject || 'No subject'}`,
                from_name: name,
                email: email,
                message: message
            })
        });

        const json = await apiResponse.json();

        if (apiResponse.status === 200) {
            res.status(200).json({ success: 'Message sent successfully to your email!' });
        } else {
            res.status(500).json({ error: 'Email API Error: ' + json.message });
        }
    } catch (error) {
        console.error('Error handling contact form submission:', error);
        res.status(500).json({ error: 'Backend Error: ' + (error.message || 'Unknown error occurred') });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
