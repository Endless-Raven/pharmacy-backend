// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const db = mysql.createConnection({
//   host:  'localhost',
//   user: 'root',
//   database:'pharmacy',
//   password: 'admin123',
//   port:"3306",
// //   timezone: 'Z'
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to Database!");
//   });

// module.exports = db;

// //queries


// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'pharmacy',
//   password: 'admin123',
//   port: '3306'
// });

// async function initializeDB() {
//   try {
//     await db;  // Ensures that the connection is made
//     console.log('Connected to Database!');
//   } catch (err) {
//     console.error('Failed to connect to Database:', err);
//   }
// }

// initializeDB();  // Calls the function to initialize the connection

// module.exports = db;


const mysql = require("mysql2/promise");
require('dotenv').config();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "pharmacy",
  password: "admin123",
  // port:"3306",
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