const linksModel = require('../models/links.model');
const { customAlphabet } = require('nanoid');
const validUrl = require('valid-url');

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
const nano = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 6);

const listLinks = async (req, res) => {
  const rows = await linksModel.findAll();
  res.json(rows);
};

const getLink = async (req, res) => {
  const { code } = req.params;
  const link = await linksModel.findOne(code);
  if (!link) return res.status(404).json({ error: "not found" });

  res.json(link);
};

const createLink = async (req, res) => {
  let { url, code } = req.body;

  if (!url) return res.status(400).json({ error: "url required" });
  if (!validUrl.isWebUri(url))
    return res.status(400).json({ error: "invalid url" });

  // Custom code validation
  if (code) {
    if (!CODE_REGEX.test(code)) {
      return res.status(400).json({ error: "invalid code format" });
    }
    const exists = await linksModel.findOne(code);
    if (exists) return res.status(409).json({ error: "code already exists" });
  }

  // Auto-generate code if not provided
  if (!code) {
    let tries = 0;
    do {
      code = nano();
      tries++;
      if (tries > 5) code = nano() + "X";
    } while (await linksModel.findOne(code));
  }

  const link = await linksModel.create({ code, url });
  res.status(201).json(link);
};

const deleteLink = async (req, res) => {
  const { code } = req.params;

  const deleted = await linksModel.remove(code);
  if (!deleted) return res.status(404).json({ error: "not found" });

  res.json({ ok: true });
};

module.exports = {
  listLinks,
  getLink,
  createLink,
  deleteLink
};
