const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql.db.bot-hosting.net',
  user: 'u382955_cg91ZkP2MU',
  password: 'SLUJGQI+OJvOi4c2TKrs@70E',
  database: 's382955_ZYNWARE',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

// Setup tables across website, bot, and app
async function initializeDatabase() {
  try {
    // User Table (used for Discord account info)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discord_id VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table \`users\` created or already exists.');

    // OAuth Tokens Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Table \`auth_tokens\` created or already exists.');

    // License Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS licenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        license_key VARCHAR(255) NOT NULL UNIQUE,
        product ENUM('Bundle', 'Optimization', 'Bypass') NOT NULL,
        hwid VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table \`licenses\` created or already exists.');

    // HWID Change History
    await db.query(`
      CREATE TABLE IF NOT EXISTS hwid_changes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        license_key VARCHAR(255) NOT NULL,
        product ENUM('Bundle', 'Optimization', 'Bypass') NOT NULL,
        old_hwid VARCHAR(255),
        new_hwid VARCHAR(255),
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table \`hwid_changes\` created or already exists.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

module.exports = db;
