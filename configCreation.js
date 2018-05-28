// Methods for writing files
const fileCreation = require('./fileCreation');
const templateEngine = require('./templateEngine');

/**
 * Writes the bin/www file, responsible for starting the server
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function wwwCreation(config, destinationFolder) {
    var wwwConfig = {
        port: config['port'] || '1337'
    };
    var template = await templateEngine.templateCreation(__dirname + '/templates/bin/www', wwwConfig);
    await fileCreation.writeFile(template, destinationFolder + '/bin/www')
    console.log('[+] Created bin/www file');
}

/**
 * Writes the app.js file, responsible for initializing routes
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function appJSCreation(config, destinationFolder) {
    var appJSConfig = {
        apiRoute: config['apiRoute'] || 'api'
    };
    var template = await templateEngine.templateCreation(__dirname + '/templates/app.js', appJSConfig);
    await fileCreation.writeFile(template, destinationFolder + '/app.js')
    console.log('[+] Created app.js file');
}

/**
 * Writes the package.json file, responsible for the dependencies and package information
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function packageJSONCreation(config, destinationFolder) {
    var packageInfo = config['packageInfo'];

    // Dialects dependences
    var dialectDependences = {
        "mssql": { library: "tedious", version: "^2.6.1" },
        "mysql": { library: "mysql2", version: "^1.5.3" },
        "sqlite": { library: "sqlite3", version: "^4.0.0" },
        "postgres": { library: "pg", version: "^7.4.3" },
    };
    var dialectDependence = config['databaseConfig']['prod']['dialect'];

    var packageJSONConfig = {
        packageName: packageInfo['name'] || 'nodequelize-api',
        packageVersion: packageInfo['version'] || '1.0.0',
        packageDescription: packageInfo['description'] || 'My Nodequelize automatically generated API',
        packageAuthor: packageInfo['author'] || 'Nodequelize',
        dialectDependence: dialectDependences[dialectDependence]
    };
    var template = await templateEngine.templateCreation(__dirname + '/templates/package.json', packageJSONConfig);
    await fileCreation.writeFile(template, destinationFolder + '/package.json')
    console.log('[+] Created package.json file');
}

/**
 * Writes the models/index.js file, responsible for syncing models to the database
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function modelsIndexCreation(config, destinationFolder) {
    var dialectOptions = '';
    if(config["databaseConfig"]["prod"]["dialect"] === 'mssql'){
        // Add special pool and dialectOptions for SQL Server and SQL Azure
        dialectOptions = 'pool: {\n';
        dialectOptions += '      max: 5,\n';
        dialectOptions += '      min: 0,\n';
        dialectOptions += '      idle: 10000\n';
        dialectOptions += '    },\n';
        dialectOptions += '    dialectOptions: {\n';
        dialectOptions += '      encrypt: true\n';
        dialectOptions += '    }';
    }
    var indexConfig = {
        dialectOptions: dialectOptions
    };
    var template = await templateEngine.templateCreation(__dirname + '/templates/models/index.js', indexConfig);
    await fileCreation.writeFile(template, destinationFolder + '/models/index.js')
    console.log('[+] Created models/index.js file');
}

async function staticFilesCreation(config, destinationFolder){
    // Adding .gitignore
    var gitignoreTemplate = await templateEngine.templateCreation(__dirname + '/templates/.gitignore', {});
    await fileCreation.writeFile(gitignoreTemplate, destinationFolder + '/.gitignore')
    console.log('[+] Created .gitignore file');
    
    // Adding IISNode.yml
    var iisNodeTemplate = await templateEngine.templateCreation(__dirname + '/templates/IISNode.yml', {});
    await fileCreation.writeFile(iisNodeTemplate, destinationFolder + '/IISNode.yml')
    console.log('[+] Created IISNode.yml file');
    
    // Adding utils.js
    var utilsTemplate = await templateEngine.templateCreation(__dirname + '/templates/utils.js', {});
    await fileCreation.writeFile(utilsTemplate, destinationFolder + '/utils.js')
    console.log('[+] Created utils.js file');
    
    // Adding controllers/utils.js
    var utilsControllersTemplate = await templateEngine.templateCreation(__dirname + '/templates/controllers/utils.js', {});
    await fileCreation.writeFile(utilsControllersTemplate, destinationFolder + '/controllers/utils.js')
    console.log('[+] Created controllers/utils.js file');
    
    // Adding views
    var errorTemplate = await templateEngine.templateCreation(__dirname + '/templates/views/error.jade', {});
    await fileCreation.writeFile(errorTemplate, destinationFolder + '/views/error.jade')
    var indexTemplate = await templateEngine.templateCreation(__dirname + '/templates/views/index.jade', {});
    await fileCreation.writeFile(indexTemplate, destinationFolder + '/views/index.jade')
    var layoutTemplate = await templateEngine.templateCreation(__dirname + '/templates/views/layout.jade', {});
    await fileCreation.writeFile(layoutTemplate, destinationFolder + '/views/layout.jade')
    console.log('[+] Created views files');
}

/**
 * Writes the config/config.json file, responsible for the connection details for Sequelize
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function dbConfigCreation(config, destinationFolder) {
    var dbConfigJSON = config['databaseConfig'];
    var db_config = {
        production: {
            username: dbConfigJSON['prod']['username'],
            password: dbConfigJSON['prod']['password'],
            database: dbConfigJSON['prod']['database'],
            host: dbConfigJSON['prod']['host'],
            port: dbConfigJSON['prod']['port'],
            dialect: dbConfigJSON['prod']['dialect'],
        },
        development: {
            username: dbConfigJSON['dev']['username'],
            password: dbConfigJSON['dev']['password'],
            database: dbConfigJSON['dev']['database'],
            host: dbConfigJSON['dev']['host'],
            port: dbConfigJSON['dev']['port'],
            dialect: dbConfigJSON['dev']['dialect'],
        }
    };
    var template = await templateEngine.templateCreation(__dirname + '/templates/config/config.json', db_config);
    await fileCreation.writeFile(template, destinationFolder + '/config/config.json')
    console.log('[+] Created config/config.json file');
}

// Expose methods
module.exports = {
    wwwCreation,
    dbConfigCreation,
    appJSCreation,
    modelsIndexCreation,
    staticFilesCreation,
    packageJSONCreation,
};