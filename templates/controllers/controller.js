const db = require('../models/index').sequelize;
const Op = require('../models/index').Sequelize.Op;
const utils = require('./utils');
const logger = require('../utils').logger;
const {{modelName}} = require ('../models').{{modelName}};
{{#includedModels}}
const {{modelName}} = require ('../models').{{modelName}};
{{/includedModels}}

module.exports = {
    /**
     * Routes different types of search for the model
     * @param {*} req 
     * @param {*} res 
     */
    async searchRecords(req, res){
        var options = utils.getSearchOptions(req);
        switch(options.field){
            case 'any': {
                this.paginatedList(req, res, options, 'list');
                break;
            }
            case 'field': {
                this.paginatedList(req, res, options, 'like');
                break;
            }
            case 'exact': {
                this.paginatedList(req, res, options, 'exact');
                break;
            }
            default:{
                logger.error('Searching on {{modelName}} with incorrect field: ' + options.field);
                return res.status(400).send({ error: true, message: 'The requested search field is not configured.' });
                break;
            }
        }
    },

    async paginatedList(req, res, options, type = 'list'){
        try {
            var whereClause = {};
            if(type == 'like') whereClause[options.field] = { [Op.like]: '%' + options.value + '%' };
            else if(type == 'exact') whereClause[options.field] = options.value;

            var includes = [
                {{#includedModels}}
                    { model: {{modelName}} },
                {{/includedModels}}
            ];

            var resFiltros = await this.filtros(req, options, whereClause, includes);
            whereClause = resFiltros.whereClause;
            includes = resFiltros.includes;

            var results = await {{modelName}}.findAndCountAll({
                where: whereClause,
                include: includes,
                offset: options.offset,
                limit: options.limit,
            });
            return res.status(200).send({ error: false, total: results.count, records: results.rows });
        } catch (error) {
            logger.error('Paginated search on {{modelName}} with error: ' + error);
            return res.status(500).send({ error: true, message: 'Your search could not be completed.' });
        }
    },
    
    async filtros(req, options, whereClause, includes) {
        try {
            return { whereClause: whereClause, includes: includes };
        } catch(error) {
            logger.error('Filtros de Usuario: ' + error);
            return { whereClause: whereClause, includes: includes };
        }
    },

    async createRecord(req, res) {
        var transaction = await db.transaction();
        try {
            var data = req.body;
            const result = await {{modelName}}.create({
                {{#fields}}
                {{name}}: data.{{name}},
                {{/fields}}
            }, { transaction: transaction });
            
            await transaction.commit();
            return res.status(201).send({ error: false, result: result });
        } catch (error) {
            logger.error('Create on {{modelName}} with error: ' + error);
            await transaction.rollback();
            return res.status(500).send({ error: true, message: 'Your record could not be created.' });
        }
    },

    async updateRecord(req, res) {
        var transaction = await db.transaction();
        try {
            var RegistroId = req.body.id;
            var data = req.body;
            const result = await {{modelName}}.update(
                {
                    {{#fields}}
                    {{name}}: data.{{name}},
                    {{/fields}}
                },
                {
                    where: { id: RegistroId },
                    transaction: transaction,
                }
            );

            await transaction.commit();
            return res.status(201).send({ error: false, result: result });
        } catch (error) {
            logger.error('Update on {{modelName}} with error: ' + error);
            await transaction.rollback();
            return res.status(500).send({ error: true, message: 'Your record could not be updated.' });
        }
    },

    async readRecord(req, res) {
        try {
            const result = await {{modelName}}.findOne({
                where: { id: req.params.id },
                {{#if includedModels}}
                include: [
                    {{#includedModels}}
                    { model: {{modelName}} },
                    {{/includedModels}}
                ],
                {{/if}}
            });
            if(result){
                return res.status(200).send(result);
            }
            else {
                return res.status(404).send({ error: true, message: 'Record not found' });
            }
        } catch (error) {
            logger.error('Read on {{modelName}} with error: ' + error);
            return res.status(500).send({ error: true, message: 'Your record could not be read.' });
        }
    },

    async listAll(req, res) {
        try {
            var results = await {{modelName}}.findAll({
                {{#if includedModels}}
                include: [
                    {{#includedModels}}
                    { model: {{modelName}} },
                    {{/includedModels}}
                ],
                {{/if}}
            });
            return res.status(200).send(results);
        } catch (error) {
            logger.error('List on {{modelName}} with error: ' + error);
            return res.status(500).send({ error: true, message: 'Your search could not be completed.' });
        }
    },

    async deleteRecord(req, res) {
        var transaction = await db.transaction();
        try {
            var RegistroId = req.params.id;
            const result = await {{modelName}}.update(
                {
                    isDeleted: true,
                },
                {
                    where: { id: RegistroId },
                    transaction: transaction,
                }
            );

            await transaction.commit();
            return res.status(201).send({ result });
        } catch (error) {
            logger.error('Delete on {{modelName}} with error: ' + error);
            await transaction.rollback();
            return res.status(500).send({ error: true, message: 'Your record could not be deleted.' });
        }
    },
};