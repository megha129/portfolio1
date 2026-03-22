require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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
        // 1. Save to MySQL database
        // Assuming there's a 'messages' table: (id, name, email, subject, message, created_at)
        const [result] = await pool.query(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'No subject', message]
        );

        // 2. Send Email Notification
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
        } else {
             console.log('Skipping email notification: EMAIL_USER or EMAIL_PASS not set.');
        }

        res.status(200).json({ success: 'Message sent and saved successfully.' });
    } catch (error) {
        console.error('Error handling contact form submission:', error);
        
        // Let's create the database and table if it doesn't exist to make setup easier for the user
        if (error.code === 'ER_BAD_DB_ERROR') {
             return res.status(500).json({ error: 'Database does not exist. Please run setup first.' });
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
             return res.status(500).json({ error: 'Messages table does not exist. Please run setup first.' });
        }
        res.status(500).json({ error: 'Failed to process message.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
