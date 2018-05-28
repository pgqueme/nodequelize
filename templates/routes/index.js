var models  = require('../models');
var express = require('express');
var router = express.Router();
var utils = require('../utils');
var apiVersion = '{{apiVersion}}';

//Required routes
{{#models}}
const {{modelName}}Route = require('./{{modelName}}');
{{/models}}

//Registered routes
{{#models}}
router.use('/{{routeEndpoint}}', {{modelName}}Route);
{{/models}}

//API start
router.get('/', function(req, res) {
    res.status(200).send({
        message: 'Welcome to the {{packageName}} API - v' + apiVersion,
    });
});

module.exports = router;