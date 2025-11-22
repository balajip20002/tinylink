const db = require('../db');

const findAll = async () => {
  const res = await db.query(
    "SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
  );
  return res.rows;
};

const findOne = async (code) => {
  const res = await db.query(
    "SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code=$1",
    [code]
  );
  return res.rows[0];
};

const create = async ({ code, url }) => {
  const res = await db.query(
    "INSERT INTO links (code, url, clicks, created_at) VALUES ($1,$2,0,now()) RETURNING *",
    [code, url]
  );
  return res.rows[0];
};

const remove = async (code) => {
  const res = await db.query(
    "DELETE FROM links WHERE code=$1 RETURNING code",
    [code]
  );
  return res.rows[0];
};

const incrementClick = async (code) => {
  const res = await db.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code=$1 RETURNING *",
    [code]
  );
  return res.rows[0];
};

module.exports = {
  findAll,
  findOne,
  create,
  remove,
  incrementClick
};
