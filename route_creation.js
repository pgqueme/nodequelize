// Methods for writing files
const file_creation = require('./file_creation');
const template_engine = require('./template_engine');

/**
 * Writes the package.json file, responsible for the dependencies and package information
 * @param {*} config 
 * @param {*} destination_folder 
 */
async function routes_index_creation(config, destination_folder) {
    var package_info = config['package_info'];
    var index_config = {
        package_name: package_info['name'] || 'nodequelize-api',
        api_version: package_info['version'] || '1.0.0',
    };
    var template = await template_engine.template_creation(__dirname + '/templates/routes/index.js', index_config);
    await file_creation.write_file(template, destination_folder + '/routes/index.js')
    console.log('[+] Created routes/index.js file');
}

// Expose methods
module.exports = {
    routes_index_creation
};