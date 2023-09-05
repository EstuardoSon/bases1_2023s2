const mysql = require("mysql2");
const dotenv = require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    dateStrings: true
});

const getConnection = () => {
    return connection.promise();
}

module.exports = {
    getConnection
}