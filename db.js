const Pool = require("pg").Pool;

const pool = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : new Pool({
      user: "postgres",
      password: "1234",
      database: "api",
      host: "localhost",
      port: 5432,
    });

module.exports = pool;
