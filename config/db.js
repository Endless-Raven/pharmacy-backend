const mysql = require("mysql2");
require('dotenv').config();

const db = mysql.createConnection({
  host:  process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:"3306",
//   timezone: 'Z'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
  });

module.exports = db;

//queries

