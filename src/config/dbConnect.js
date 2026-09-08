const { Pool } = require("pg")

const isTest = process.env.NODE_ENV === "test"

// * En entorno de test se usa una base de datos separada (TEST_DB_*) para no
// * pisar datos de desarrollo. En el resto de los casos: DATABASE_URL
// * (formato que suele proveer Railway) si existe, o las variables DB_* individuales.
const poolConfig = process.env.DATABASE_URL && !isTest
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: Number(process.env.DB_MAX) || 10,
      idleTimeoutMillis: Number(process.env.DB_IDLETIMEOUT) || 30000,
      connectionTimeoutMillis: Number(process.env.DB_CONNECTIMEOUT) || 5000,
    }
  : {
      host: isTest ? process.env.TEST_DB_HOST : process.env.DB_HOST,
      port: isTest ? process.env.TEST_DB_PORT : process.env.DB_PORT,
      database: isTest ? process.env.TEST_DB_DATABASE : process.env.DB_DATABASE,
      user: isTest ? process.env.TEST_DB_USER : process.env.DB_USER,
      password: isTest ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
      max: Number(process.env.DB_MAX) || 10,
      idleTimeoutMillis: Number(process.env.DB_IDLETIMEOUT) || 30000,
      connectionTimeoutMillis: Number(process.env.DB_CONNECTIMEOUT) || 5000,
    }

const pool = new Pool(poolConfig)

module.exports = {
  pool,
}