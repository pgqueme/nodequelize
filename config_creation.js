// Methods for writing files
const file_creation = require('./file_creation');
const template_engine = require('./template_engine');

/**
 * Writes the bin/www file, responsible of starting the server
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
 * Writes the bin/www file, responsible of starting the server
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
 * Writes the config/config.json file, responsible of the connection details for Sequelize
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function db_config_creation(config, destination_folder) {
    var db_config_json = config['database-config'];
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
};