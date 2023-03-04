const {Pool} = require('pg');

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database : "Week9",
    password : "kratonyk1999",
    port: 5432
});

module.exports = pool;