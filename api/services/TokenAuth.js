// services/TokenAuth.js

const jwt = require('jsonwebtoken');

const TokenAuth = {

  generateToken: function(payload) {
    return jwt.sign(payload, sails.config.jwt.tokenSecret);
  },

  verifyToken: function(token, cb) {
    return jwt.verify(token, sails.config.jwt.tokenSecret, {}, cb);
  },

  decodeToken: function(token, cb) {
    return jwt.decode(token, sails.config.jwt.tokenSecret, {}, cb);
  }
};

module.exports = TokenAuth;
