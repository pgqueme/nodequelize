#!/usr/bin/env node
//CLI interface package
const program = require('commander');
const config_creation = require('./config_creation');
const route_creation = require('./route_creation');

//Version command
program
    .version('0.0.4')
    .description('NodeJS REST API generator using Express and Sequelize');

//Create project
program
    .command('create_project <config_file> [destination_folder]')
    .alias('cp')
    .description('Creates a new REST API project to the same folder')
    .action((config_file, destination_folder) => {
        create_project(config_file, destination_folder);
    });
    
program.parse(process.argv);
    
async function create_project(config_file, destination_folder_param) {
    console.log('---------- Starting nodequelize project creation ----------');
    
    // Get the configuration options
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync(config_file, 'utf8'));

    // Clean folder name
    var destination_folder = './';
    if(destination_folder_param){
        if(destination_folder_param.substr(-1) == '/'){
            destination_folder = destination_folder_param.slice(0, -1);
        }
    }

    // Create bin/www file
    await config_creation.www_creation(config, destination_folder);
    
    // Create database configuration file
    await config_creation.db_config_creation(config, destination_folder);    
    
    // Create app.js file
    await config_creation.app_js_creation(config, destination_folder);

    // Models file
    await config_creation.models_index_creation(config, destination_folder);
    
    // Static files
    await config_creation.static_files_creation(config, destination_folder);
    
    // Package.json file
    await config_creation.package_json_creation(config, destination_folder);

    // Routes creation
    await route_creation.routes_index_creation(config, destination_folder);

    console.log('---------- Finishing nodequelize project creation. Enjoy your API! ----------');
}