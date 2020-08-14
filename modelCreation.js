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
    var authConfig = config['authConfig'];
    
    // Loop through all models
    var models = config['models'];
    var modelsConfigs = [];
    var modelsConfigsControllers = [];
    for (let i = 0; i < models.length; i++) {
        // Get data
        const model = models[i];
        var fields = model['fields'].slice();
        
        // Included models
        var includedModels = [];
        for (let j = 0; j < model['associations'].length; j++) {
            const association = model['associations'][j];
            if(association["include"]){
                includedModels.push({ "modelName": association["model"] })
            }
            // Add all the belongsTo associations to fields
            if(association["type"] === 'belongsTo') {
                fields.push({ name: association['foreignKey'] });
            }
        }
        
        var modelConfig = {
            modelName: model['modelName'],
            tableName: model['tableName'],
            routeEndpoint: model['routeEndpoint'],
            generateController: model['generateController'],
            fields: model['fields'],
            associations: model['associations'],
            includedModels: includedModels,
            auth: authConfig
        }
        
        modelsConfigs.push(modelConfig);
        if(modelConfig.generateController) modelsConfigsControllers.push(modelConfig);
        
        // Create the model
        var templateModel = await templateEngine.templateCreation(__dirname + '/templates/models/model.js', modelConfig);
        await fileCreation.writeFile(templateModel, destinationFolder + '/models/' + modelConfig.modelName + '.js');
        console.log('[+] Created ' + modelConfig.modelName + ' model');
        
        modelConfig.fields = fields;
        if(modelConfig.generateController) {
            // Create the controller
            var templateController = await templateEngine.templateCreation(__dirname + '/templates/controllers/controller.js', modelConfig);
            await fileCreation.writeFile(templateController, destinationFolder + '/controllers/' + modelConfig.modelName + '.js');
            console.log('[+] Created ' + modelConfig.modelName + ' controller');

            // Create the routes
            var templateRoutes = await templateEngine.templateCreation(__dirname + '/templates/routes/route.js', modelConfig);
            await fileCreation.writeFile(templateRoutes, destinationFolder + '/routes/' + modelConfig.modelName + '.js');
            console.log('[+] Created ' + modelConfig.modelName + ' router');
        }
        
    }
    
    // Create the controller index
    var templateControllerIndex = await templateEngine.templateCreation(__dirname + '/templates/controllers/index.js', { models: modelsConfigsControllers });
    await fileCreation.writeFile(templateControllerIndex, destinationFolder + '/controllers/index.js');
    console.log('[+] Created controllers/index.js');
    
    // Create the routes index
    var routeIndexConfig = {
        models: modelsConfigsControllers,
        apiVersion: config['packageInfo']['version'],
        auth: config['authConfig']
    };
    var templateRoutesIndex = await templateEngine.templateCreation(__dirname + '/templates/routes/index.js', routeIndexConfig);
    await fileCreation.writeFile(templateRoutesIndex, destinationFolder + '/routes/index.js');
    console.log('[+] Created routes/index.js');
    var templateValues = await templateEngine.templateCreation(__dirname + '/templates/routes/values.js', routeIndexConfig);
    await fileCreation.writeFile(templateValues, destinationFolder + '/routes/values.js');
    console.log('[+] Created routes/values.js');
}

// Expose methods
module.exports = {
    modelsCreation
};