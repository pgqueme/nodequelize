var basicAuth = require('basic-auth');
var winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({
            stack: true
        }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'combined.log'
        }),
        new winston.transports.Console({
            
        }),
    ]
});


exports.logger = logger;

exports.basicAuth = function (username, password) {
    return function (req, res, next) {
        logger.info('------------------------------------------------------------');
        if(req) logger.info(req.originalUrl);
        
        var user = basicAuth(req);

        if (!user || user.name !== username || user.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            return res.sendStatus(401);
        }

        next();
    };
};