//Methods for writing files
const file_creation = require('./file_creation');
const template_engine = require('./template_engine');

/**
 * Writes the bin/www file, responsible of starting the server
 */
async function www_creation(config, destination_folder) {
    var www_config = {
        port: config['port']
    };
    var template = await template_engine.template_creation(__dirname + '/templates/bin/www', www_config);
    await file_creation.write_file(template, destination_folder + '/bin/www')
    console.log('[+] Created bin/www file');
}

async function db_config_creation(config, destination_folder) {
    var db_config_json = config['database-config'];
    var db_config = {
        username: db_config_json['username'],
        password: db_config_json['password'],
        database: db_config_json['database'],
        host: db_config_json['host'],
        port: db_config_json['port'],
        dialect: db_config_json['dialect'],
    };
    var template = await template_engine.template_creation(__dirname + '/templates/config/config.json', db_config);
    await file_creation.write_file(template, destination_folder + '/config/config.json')
    console.log('[+] Created config/config.json file');
}

module.exports = {
    www_creation,
    db_config_creation,
};