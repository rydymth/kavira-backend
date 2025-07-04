const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const giftRoutes = require('./routes/gifts');
const cartRoutes = require('./routes/cart');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/cart', cartRoutes);

const PORT = 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});