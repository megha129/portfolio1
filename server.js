require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first'); // Force IPv4 to fix Render ENETUNREACH IPv6 bug
}
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    try {
        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to your own email account
            subject: `New Portfolio Message from ${name}: ${subject || 'No subject'}`,
            text: `You have received a new contact message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h3>New Portfolio Contact</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
             await transporter.sendMail(mailOptions);
             res.status(200).json({ success: 'Message sent successfully to your email!' });
        } else {
             console.log('Skipping email notification: EMAIL_USER or EMAIL_PASS not set.');
             res.status(500).json({ error: 'Email configuration is completely missing on the server.' });
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
