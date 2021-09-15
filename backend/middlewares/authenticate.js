'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ke221199';

exports.auth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'NoHeadersERROR' });
  }
  var token = req.headers.authorization.replace(/['"]+/g, '');
  var segment = token.split('.');
  console.log(token);
  console.log(segment);

  if (segment.length != 3) {
    return res.status(403).send({ message: 'InvalidToken' });
  } else {
    try {
      var payload = jwt.decode(token, secret);
    } catch (error) {
      return res.status(403).send({ message: 'InvalidToken2' });
    }
  }
  req.user = payload;

  next();
};
/** */
