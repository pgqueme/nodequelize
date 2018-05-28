#!/usr/bin/env node
//CLI interface package
const program = require('commander');
const config_creation = require('./config_creation');
const route_creation = require('./route_creation');
const version = "0.2.0";

//Version command
program
    .version(version, '-v, --version')
    .description('NodeJS REST API generator using Express and Sequelize');

//Create project
program
    .command('create_project <configFile> [destinationFolder]')
    .alias('cp')
    .description('Creates a new REST API project to the same folder')
    .action((configFile, destinationFolder) => {
        create_project(configFile, destinationFolder);
    });
    
program.parse(process.argv);
    
async function create_project(configFile, destinationFolderParam) {
    console.log('---------- Starting nodequelize project creation ----------');
    
    // Get the configuration options
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    // Clean folder name
    var destinationFolder = './';
    if(destinationFolderParam){
        if(destinationFolderParam.substr(-1) == '/'){
            destinationFolder = destinationFolderParam.slice(0, -1);
        }
    }

    // Create bin/www file
    await config_creation.wwwCreation(config, destinationFolder);
    
    // Create database configuration file
    await config_creation.dbConfigCreation(config, destinationFolder);    
    
    // Create app.js file
    await config_creation.appJSCreation(config, destinationFolder);

    // Models file
    await config_creation.modelsIndexCreation(config, destinationFolder);
    
    // Static files
    await config_creation.staticFilesCreation(config, destinationFolder);
    
    // Package.json file
    await config_creation.packageJSONCreation(config, destinationFolder);

    // Routes creation
    await route_creation.routesIndexCreation(config, destinationFolder);

    console.log('---------- Finishing nodequelize project creation. Enjoy your API! ----------');
}