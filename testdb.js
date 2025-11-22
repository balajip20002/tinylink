require('dotenv').config();
console.log("DATABASE_URL =", process.env.DATABASE_URL);

const pool = require('./src/db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("❌ Database error:", err);
  } else {
    console.log("✅ Connected to Neon! Time:", res.rows[0]);
  }
  pool.end();
});
