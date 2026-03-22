require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixDatabase() {
    try {
        console.log('Connecting to database to fix schema...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db'
        });

        console.log('Dropping old messages table...');
        await connection.query('DROP TABLE IF EXISTS messages');
        
        console.log('Recreating messages table with correct columns...');
        const createTableQuery = `
            CREATE TABLE messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);

        console.log('Database successfully fixed!');
        await connection.end();
    } catch (err) {
        console.error("Error fixing database:", err.message);
    }
}

fixDatabase();
