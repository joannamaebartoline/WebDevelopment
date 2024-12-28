// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wannamae',  // Your MySQL password
    database: 'test', // Your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
});

module.exports = db;
