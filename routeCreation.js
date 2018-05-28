// Methods for writing files
const fileCreation = require('./fileCreation');
const templateEngine = require('./templateEngine');

/**
 * Writes the package.json file, responsible for the dependencies and package information
 * @param {*} config 
 * @param {*} destinationFolder 
 */
async function routesIndexCreation(config, destinationFolder) {
    var packageInfo = config['packageInfo'];
    var indexConfig = {
        packageName: packageInfo['name'] || 'nodequelize-api',
        apiVersion: packageInfo['version'] || '1.0.0',
    };
    var template = await templateEngine.templateCreation(__dirname + '/templates/routes/index.js', indexConfig);
    await fileCreation.writeFile(template, destinationFolder + '/routes/index.js')
    console.log('[+] Created routes/index.js file');
}

// Expose methods
module.exports = {
    routesIndexCreation
};