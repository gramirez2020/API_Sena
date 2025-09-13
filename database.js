const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a MariaDB exitosa!');
    connection.release(); // Libera la conexión
  } catch (error) {
    console.error('Error al conectar a MariaDB:', error);
  }
}

module.exports = { pool, testConnection };