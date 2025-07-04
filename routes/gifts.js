const express = require('express');
const { Gift } = require('../models');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const gift = await Gift.create(req.body);
    res.json(gift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const gifts = await Gift.findAll();
  res.json(gifts);
});

router.get('/category/:cat', async (req, res) => {
  const gifts = await Gift.findAll({ where: { category: req.params.cat } });
  res.json(gifts);
});

module.exports = router;