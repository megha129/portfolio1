require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    try {
        // Connect without database selected
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create Database if not exists
        const dbName = process.env.DB_NAME || 'portfolio_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' ensured.`);

        // Use the database
        await connection.query(`USE \`${dbName}\`;`);

        // Create table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log("Table 'messages' ensured.");

        await connection.end();
        console.log("Database setup is complete!");
    } catch (err) {
        console.error("Error setting up database:", err);
    }
}

setupDatabase();
