const sequelize = require('../config/db.js');
const User = require('./users.js');
const Gift = require('./gifts.js');
const CartItem = require('./cartItems.js');

module.exports = { sequelize, User, Gift, CartItem };