const express = require('express');
const { CartItem, Gift } = require('../models');
const jwt = require('jsonwebtoken');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// router.post('/add', auth, async (req, res) => {
//   const { giftId, quantity } = req.body;
//   try {
//     const item = await CartItem.create({
//       GiftId: giftId,
//       UserId: req.userId,
//       quantity,
//     });
//     res.json(item);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get('/', auth, async (req, res) => {
//   const items = await CartItem.findAll({
//     where: { UserId: req.userId },
//     include: Gift,
//   });
//   res.json(items);
// });

router.post('/', async (req, res) => {
  const { UserId, GiftId, quantity } = req.body;
  try {
    // Check if item already exists
    const existing = await CartItem.findOne({ where: { UserId, GiftId } });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json(existing);
    }

    const cartItem = await CartItem.create({ UserId, GiftId, quantity });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
});

// GET /api/cart/:userId – Get all items for a user
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { UserId: req.params.userId },
      include: [{ model: Gift }]
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// DELETE /api/cart/:id – Remove cart item
router.delete('/:id', async (req, res) => {
  try {
    await CartItem.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// (Optional) PUT /api/cart/:id – Update quantity
router.put('/:id', async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (!cartItem) return res.status(404).json({ error: 'Item not found' });

    cartItem.quantity = req.body.quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

module.exports = router;