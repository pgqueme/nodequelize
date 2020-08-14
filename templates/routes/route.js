var models  = require('../models');
var express = require('express');
var router = express.Router();
var utils = require('../utils');
const controller = require('../controllers').{{modelName}}Controller;
var values = require('./values');
var auth = require('../auth');

router.get('/', auth.validarTokenPermisos([auth.permisos.CUALQUIERA]), function(req, res) {
    controller.listAll(req, res);
});

router.get('/search', auth.validarTokenPermisos([auth.permisos.CUALQUIERA]), function(req, res) {
    controller.searchRecords(req, res);
});

router.get('/id/:id', auth.validarTokenPermisos([auth.permisos.CUALQUIERA]), function(req, res) {
    controller.readRecord(req, res);
});

router.post('/', auth.validarTokenPermisos([auth.permisos.ADMINISTRADOR]), function(req, res) {
    controller.createRecord(req, res);
});

router.put('/', auth.validarTokenPermisos([auth.permisos.ADMINISTRADOR]), function(req, res) {
    controller.updateRecord(req, res);
});

router.delete('/id/:id', auth.validarTokenPermisos([auth.permisos.ADMINISTRADOR]), function(req, res) {
    controller.deleteRecord(req, res);
});

module.exports = router;