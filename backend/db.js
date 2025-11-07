require("dotenv").config()
const mysql = require("mysql2/promise");



const db = mysql.createPool({
  host: 'localhost',   
  user: 'root',         
  password: process.env.DBPass,
  database: 'productivity_app',  
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL successfully!");
    connection.release();
  } catch (err) {
    console.error("Error connecting to MySQL:", err.message);
  }
})();

module.exports = db;