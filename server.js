const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((res) => {
    // console.log(res);
    // console.log(res.now());
    // console.log(res.STATES);
    /*
    [Object: null prototype] {
  '0': 'disconnected',
  '1': 'connected',
  '2': 'connecting',
  '3': 'disconnecting',
  '99': 'uninitialized',
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
  uninitialized: 99
}
    */

    // console.log(res.connection);

    switch (res.STATES[res.connection.readyState]) {
      case 'connected':
        console.log('Database connected successfully');
        break;
      case 'connecting':
        console.log('Database connecting...');
        break;
      case 'disconnecting':
        console.log('Database disconnecting...');
        break;
      case 'disconnected':
        console.log('Database disconnected');
        break;
      case 'uninitialized':
        console.log('Database uninitialized');
        break;
      default:
        console.log('Database connection error');
        break;
    }

    // console.log('Database connected successfully');
  })
  .catch((err) => {
    console.log('error', err);
  });

app.listen(PORT, () => {
  console.log(`server started successfully on ${PORT}`);
});
