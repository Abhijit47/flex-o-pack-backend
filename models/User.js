const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'A User must have a valid first name'],
  },
  lastName: {
    type: String,
    required: [true, 'A User must have a valid last name'],
  },
  email: {
    type: String,
    required: [true, 'A User must have a valid email'],
  },
  password: {
    type: String,
    required: [true, 'A User must provide a valid password'],
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'moderator'],
      message: '{VALUE} is not supported',
    },
  },
});

const User = model('User', userSchema);
module.exports = User;
