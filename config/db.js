//database connection configuration
const pg = require('pg');

const config = {
  user: "postgres",
  password: "zatar123!",
  host: "interns.postgres.database.azure.com",
  port: 5432,
  database: "majd",
};

const pool = new pg.Pool(config);

module.exports = pool;
