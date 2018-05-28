const db = require('../models/index').sequelize;
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
                this.paginatedList(res, options);
                break;
            }
            default:{
                logger.error('Searching on {{modelName}} with incorrect field: ' + options.field);
                return res.status(400).send({ error: true, message: 'The requested search field is not configured.' });
                break;
            }
        }
    },

    async paginatedList(res, options){
        try {
            var results = await {{modelName}}.findAndCountAll({
                offset: options.offset,
                limit: options.limit,
                {{#if includedModels}}
                include: [
                    {{#includedModels}}
                    { model: {{modelName}} },
                    {{/includedModels}}
                ],
                {{/if}}
            });
            return res.status(200).send({ error: false, total: results.count, records: results.rows });
        } catch (error) {
            logger.error('Paginated search on {{modelName}} with error: ' + error);
            return res.status(500).send({ error: true, message: 'Your search could not be completed.' });
        }
    },
    
    async createRecord(req, res) {
        try {
            const result = await {{modelName}}.create({
                {{#fields}}
                {{name}}: req.body.{{name}},
                {{/fields}}
            });
            res.status(201).send({ error: false, result: result });
        } catch (error) {
            logger.error('Create on {{modelName}} with error: ' + error);
            return res.status(500).send({ error: true, message: 'Your record could not be created.' });
        }
    },

    async updateRecord(req, res) {
        try {
            const result = await {{modelName}}.update(
                {
                    {{#fields}}
                    {{name}}: req.body.{{name}},
                    {{/fields}}
                },
                {
                    where: { id: req.body.id }
                }
            );
            res.status(201).send({ error: false, result: result });
        } catch (error) {
            logger.error('Update on {{modelName}} with error: ' + error);
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
                res.status(200).send(result);
            }
            else {
                res.status(404).send({ error: true, message: 'Record not found' });
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
        try {
            const result = await {{modelName}}.destroy({
                where: { id: req.params.id },
            });
            res.status(201).send(result);
        } catch (error) {
            logger.error('Read on {{modelName}} with error: ' + error);
            return res.status(500).send({ error: true, message: 'Your record could not be read.' });
        }
    },
};