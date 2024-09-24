
const mysql = require("mysql2/promise");
require('dotenv').config();

const db = mysql.createPool({
  host: "versalifepharmacy.c744e6yi8s7w.eu-north-1.rds.amazonaws.com",
  user: "root",
  database: "pharmacy",
  password: "Versalife123*",
  port:"3306",
  // timezone: 'Z'
});

// Function to test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection(); // Get a connection from the pool
    console.log("Connected to Database!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
  }
}

// Call the function to test the connection
testConnection();

module.exports = db;