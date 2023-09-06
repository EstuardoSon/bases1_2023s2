const mysql = require("mysql2");
const dotenv = require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  dateStrings: true,
});

const getConnection = () => {
  try {
    connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE};`);
    connection.promise().query(
        `ALTER DATABASE ${process.env.DATABASE} CHARACTER SET utf8 COLLATE utf8_spanish_ci;`
      );
    connection.changeUser({ database: process.env.DATABASE });

    return connection.promise();
  } catch (error) {
    console.error("Error al establecer la conexión:", error);
    throw conexion;
  }
};

module.exports = {
  getConnection,
};
