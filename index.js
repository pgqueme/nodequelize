#!/usr/bin/env node
//CLI interface package
const program = require('commander');
const config_creation = require('./config_creation');

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
    // ### Get the configuration options ###
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync(config_file, 'utf8'));

    //Clean folder name
    var destination_folder = './';
    if(destination_folder_param){
        if(destination_folder_param.substr(-1) == '/'){
            destination_folder = destination_folder_param.slice(0, -1);
        }
    }

    //Create bin/www file
    await config_creation.www_creation(config, destination_folder);
    
    //Create database configuration file
    await config_creation.db_config_creation(config, destination_folder);    
    
    /*
    //Create app.js file
    template_engine.template_creation('templates/app.js', {})
    .then(template => {
        file_creation.write_file(template, destination_folder + '/app.js')
        .then(result => {
            console.log('Created app.js file');
        });
    });
    */
    console.log('---------- Finishing nodequelize project creation. Enjoy your API! ----------');
}