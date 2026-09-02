const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST || "mysql",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "travelease_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkDatabaseConnection() {
    for (let attempt = 1; attempt <= 20; attempt++) {
        try {
            const connection = await db.getConnection();
            console.log("✅ MySQL connected successfully");
            connection.release();
            return;
        } catch (error) {
            console.log(`⏳ Waiting for MySQL... attempt ${attempt}/20`);
            if (attempt === 20) {
                console.error("❌ MySQL connection failed:", error.message);
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

checkDatabaseConnection();

module.exports = db;
