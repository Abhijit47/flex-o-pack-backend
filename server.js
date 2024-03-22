const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((res) => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.log('error', err);
  });

app.listen(PORT, () => {
  console.log(`server started successfully on ${PORT}`);
});
