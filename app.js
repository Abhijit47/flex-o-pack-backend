const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const productRouter = require('./routes/productRoutes');

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome route' });
});

app.use('/api/v1/product', productRouter);

app.all('*', (req, res, next) => {
  return res.status(500).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
