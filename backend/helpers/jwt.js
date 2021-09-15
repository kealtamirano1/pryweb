'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ke221199';

exports.createToken = function (user) {
  var payload = {
    sub: user._id,
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    rol: user.rol,
    iat: moment().unix(),
    exp: moment().add(7, 'days'),
  };

  return jwt.encode(payload, secret);
};
