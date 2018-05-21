var models  = require('../models');
var express = require('express');
var router = express.Router();
var utils = require('../utils');
var apiVersion = '{{api_version}}';

//Required routes
{{routes_requires}}

//Registered routes
{{routes_endpoints}}

//API start
router.get('/', function(req, res) {
    res.status(200).send({
        message: 'Welcome to the {{package_name}} API - v' + apiVersion,
    });
});

module.exports = router;