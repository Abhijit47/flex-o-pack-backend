const crypto = require('crypto');
const mongoose = require('mongoose');

function createHashPassword(password) {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    password,
    salt,
    310000,
    32,
    'sha256',
    function (err, derivedKey) {
      if (err) {
        return err.message;
      }

      // console.log('hashedPassword..', derivedKey.toString('hex'));
      return derivedKey.toString('hex');
    }
  );

  // return hashedPassword;
}

function purgeCache(cacheName) {
  const cacheKeys = cacheName.keys();
  if (cacheKeys.length > 0) {
    cacheName.flushAll();
    cacheName.flushStats();
  }
}

// check specifications array that key are exists in req.body or not
function isValidSpecifications(specifications, body) {
  return specifications.every((key) => body.hasOwnProperty(key));
}

// check if the id is valid or not
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  createHashPassword,
  purgeCache,
  isValidSpecifications,
  isValidId,
};
