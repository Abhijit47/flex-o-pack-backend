const { join } = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');
const commentRouter = require('./routes/commentRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.enable('trust proxy');

// GLOBAL MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(join(__dirname, 'public')));

// CORS ENABLED
app.use(cors());
app.options('*', cors());

// Development logging
if (process.env.NODE_ENV === 'dev ') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome route' });
});

// Routes
app.use('/api/v1/product', productRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/comment', commentRouter);

// error handler
app.all('*', (req, res, next) => {
  return next(
    new AppError(
      `Can't ${req.method} request on this ${req.originalUrl}URL.`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
