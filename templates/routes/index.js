var models  = require('../models');
var express = require('express');
var router = express.Router();
var utils = require('../utils');
var apiVersion = '{{apiVersion}}';

//Required routes
{{routes_requires}}

//Registered routes
{{routes_endpoints}}

//API start
router.get('/', function(req, res) {
    res.status(200).send({
        message: 'Welcome to the {{packageName}} API - v' + apiVersion,
    });
});

module.exports = router;