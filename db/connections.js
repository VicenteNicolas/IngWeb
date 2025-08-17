const mysql = require('mysql2');
require('dotenv').config();

const dbReader = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const dbWriter = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_WRITER_USER,
    password: process.env.DB_WRITER_PASSWORD,
    database: process.env.DB_NAME
});

const dbAdmin = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = { dbReader, dbWriter, dbAdmin };
