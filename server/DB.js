const mysql = require('mysql2');
const config = require('./config/config')

const pool = mysql.createPool({
  host: config.DB_HOST,
  user: 'root',
  database: 'carpool_db',
  port: config.DB_PORT,
  password: config.DB_PASSWORD,
}).promise();

module.exports = pool;