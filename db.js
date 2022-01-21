const { Pool } = require("pg");

const poolconfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: "postgres",
      password: "1234",
      database: "api",
      host: "localhost",
      port: 5432,
    };

const pool=new Pool(poolconfig)
module.exports = pool;
