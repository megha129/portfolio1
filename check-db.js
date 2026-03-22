require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabase() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db'
        });

        console.log('Connected successfully! Fetching messages...\n');
        const [rows] = await connection.query('SELECT * FROM messages');

        if (rows.length === 0) {
            console.log('Your database is working, but there are no messages saved yet.');
            console.log('Try submitting the contact form on your website first!');
        } else {
            console.log(`Found ${rows.length} message(s) saved in your database:\n`);
            console.table(rows);
        }

        await connection.end();
    } catch (err) {
        console.error("Error connecting to database:", err.message);
    }
}

checkDatabase();
