// Methods for writing files
const fileCreation = require('./fileCreation');
const templateEngine = require('./templateEngine');

/**
 * Creates the models files, which represent tables on Sequelize
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function modelsCreation(config, destinationFolder) {
    var fields = [];
    var associations = [];

    // Loop through all models
    var models = config['models'];
    for (let i = 0; i < models.length; i++) {
        // Get data
        const model = models[i];
        var modelConfig = {
            modelName: model['modelName'],
            tableName: model['tableName'],
            fields: model['fields'],
            associations: model['associations']
        }
    
        // Create the file
        var template = await templateEngine.templateCreation(__dirname + '/templates/models/model.js', modelConfig);
        await fileCreation.writeFile(template, destinationFolder + '/models/' + modelConfig.modelName + '.js');
        console.log('[+] Created ' + modelConfig.modelName + ' model');
    }
}

// Expose methods
module.exports = {
    modelsCreation
};