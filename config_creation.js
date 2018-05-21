// Methods for writing files
const file_creation = require('./file_creation');
const template_engine = require('./template_engine');

/**
 * Writes the bin/www file, responsible for starting the server
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function www_creation(config, destination_folder) {
    var www_config = {
        port: config['port'] || '1337'
    };
    var template = await template_engine.template_creation(__dirname + '/templates/bin/www', www_config);
    await file_creation.write_file(template, destination_folder + '/bin/www')
    console.log('[+] Created bin/www file');
}

/**
 * Writes the app.js file, responsible for initializing routes
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function app_js_creation(config, destination_folder) {
    var app_js_config = {
        api_route: config['api_route'] || 'api'
    };
    var template = await template_engine.template_creation(__dirname + '/templates/app.js', app_js_config);
    await file_creation.write_file(template, destination_folder + '/app.js')
    console.log('[+] Created app.js file');
}

/**
 * Writes the package.json file, responsible for the dependencies and package information
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function package_json_creation(config, destination_folder) {
    var package_info = config['package_info'];
    var package_json_config = {
        package_name: package_info['name'] || 'nodequelize-api',
        package_version: package_info['version'] || '1.0.0',
        package_description: package_info['description'] || 'My Nodequelize automatically generated API',
        package_author: package_info['author'] || 'Nodequelize',
    };
    var template = await template_engine.template_creation(__dirname + '/templates/package.json', package_json_config);
    await file_creation.write_file(template, destination_folder + '/package.json')
    console.log('[+] Created package.json file');
}

/**
 * Writes the models/index.js file, responsible for syncing models to the database
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function models_index_creation(config, destination_folder) {
    var dialect_options = '';
    if(config["database_config"]["prod"]["dialect"] === 'mssql'){
        // Add special pool and dialectOptions for SQL Server and SQL Azure
        dialect_options = 'pool: {\n';
        dialect_options += '      max: 5,\n';
        dialect_options += '      min: 0,\n';
        dialect_options += '      idle: 10000\n';
        dialect_options += '    },\n';
        dialect_options += '    dialectOptions: {\n';
        dialect_options += '      encrypt: true\n';
        dialect_options += '    }';
    }
    var index_config = {
        dialect_options: dialect_options
    };
    var template = await template_engine.template_creation(__dirname + '/templates/models/index.js', index_config);
    await file_creation.write_file(template, destination_folder + '/models/index.js')
    console.log('[+] Created models/index.js file');
}

async function static_files_creation(config, destination_folder){
    // Adding .gitignore
    var gitignore_template = await template_engine.template_creation(__dirname + '/templates/.gitignore', {});
    await file_creation.write_file(gitignore_template, destination_folder + '/.gitignore')
    console.log('[+] Created .gitignore file');
    
    // Adding IISNode.yml
    var iisnode_template = await template_engine.template_creation(__dirname + '/templates/IISNode.yml', {});
    await file_creation.write_file(iisnode_template, destination_folder + '/IISNode.yml')
    console.log('[+] Created IISNode.yml file');
    
    // Adding utils.js
    var utils_template = await template_engine.template_creation(__dirname + '/templates/utils.js', {});
    await file_creation.write_file(utils_template, destination_folder + '/utils.js')
    console.log('[+] Created utils.js file');
    
    // Adding views
    var error_template = await template_engine.template_creation(__dirname + '/templates/views/error.jade', {});
    await file_creation.write_file(error_template, destination_folder + '/views/error.jade')
    var index_template = await template_engine.template_creation(__dirname + '/templates/views/index.jade', {});
    await file_creation.write_file(index_template, destination_folder + '/views/index.jade')
    var layout_template = await template_engine.template_creation(__dirname + '/templates/views/layout.jade', {});
    await file_creation.write_file(layout_template, destination_folder + '/views/layout.jade')
    console.log('[+] Created views files');
}

/**
 * Writes the config/config.json file, responsible for the connection details for Sequelize
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function db_config_creation(config, destination_folder) {
    var db_config_json = config['database_config'];
    var db_config = {
        production: {
            username: db_config_json['prod']['username'],
            password: db_config_json['prod']['password'],
            database: db_config_json['prod']['database'],
            host: db_config_json['prod']['host'],
            port: db_config_json['prod']['port'],
            dialect: db_config_json['prod']['dialect'],
        },
        development: {
            username: db_config_json['dev']['username'],
            password: db_config_json['dev']['password'],
            database: db_config_json['dev']['database'],
            host: db_config_json['dev']['host'],
            port: db_config_json['dev']['port'],
            dialect: db_config_json['dev']['dialect'],
        }
    };
    var template = await template_engine.template_creation(__dirname + '/templates/config/config.json', db_config);
    await file_creation.write_file(template, destination_folder + '/config/config.json')
    console.log('[+] Created config/config.json file');
}

// Expose methods
module.exports = {
    www_creation,
    db_config_creation,
    app_js_creation,
    models_index_creation,
    static_files_creation,
    package_json_creation,
};