const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/links.controller');

router.post('/links', ctrl.createLink);
router.get('/links', ctrl.listLinks);
router.get('/links/:code', ctrl.getLink);
router.delete('/links/:code', ctrl.deleteLink);

module.exports = router;
