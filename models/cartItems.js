const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./users.js');
const Gift = require('./gifts.js');

const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

User.hasMany(CartItem);
CartItem.belongsTo(User);

Gift.hasMany(CartItem);
CartItem.belongsTo(Gift);

module.exports = CartItem;