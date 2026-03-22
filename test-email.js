require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("Testing email connection for:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.error("TEST FAILED WITH ERROR:");
        console.error(error.message);
        process.exit(1);
    } else {
        console.log("TEST SUCCESSFUL! Server is ready to take our messages.");
        process.exit(0);
    }
});
