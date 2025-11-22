const express = require('express');
const router = express.Router();
const linksModel = require('../models/links.model');

router.get('/:code', async (req, res) => {
  const { code } = req.params;
  const link = await linksModel.findOne(code);

  if (!link) return res.status(404).send("Not found");

  await linksModel.incrementClick(code);

  return res.redirect(302, link.url);
});

module.exports = router;
