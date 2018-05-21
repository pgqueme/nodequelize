var basicAuth = require('basic-auth');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs.log' });
exports.logger = winston;

exports.basicAuth = function(username, password) {
  return function(req, res, next) {
    var user = basicAuth(req);

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }

    next();
  };
};
