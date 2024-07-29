const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'A User must have a valid first name'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'A User must have a valid last name'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'A User must have a valid email'],
    },
    password: {
      type: String,
      required: [true, 'A User must provide a valid password'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'moderator', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    blogs: {
      type: [ObjectId],
      ref: 'Blog',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Schema methods to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Schema methods to compare the password
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Schema methods to generate the token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Schema methods to select the fields to return
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model('User', userSchema);
module.exports = User;
