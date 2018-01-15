#!/usr/bin/env node
//CLI interface package
const program = require('commander');
//Methods for writing files
const file_creation = require('./file_creation');
const template_engine = require('./template_engine');

//Version command
program
    .version('0.0.3')
    .description('NodeJS REST API generator using Express and Sequelize');

//Create files
program
    .command('create_project <config_file> [destination_folder]')
    .alias('cp')
    .description('Creates a new REST API project to the same folder')
    .action((config_file, destination_folder) => {
        //Get the configuration options
        const fs = require('fs');
        const config = JSON.parse(fs.readFileSync(config_file, 'utf8'));
        
        //Clean folder name
        if(!destination_folder || destination_folder.trim() == ''){
            destination_folder = '';
        }
        else if(destination_folder.substr(-1) == '/'){
            destination_folder = destination_folder.slice(0, -1);
        }

        //Create bin/www file
        template_engine.template_creation('templates/bin/www', { port: config['port'] })
        .then(template => {
            file_creation.write_file(template, destination_folder + '/bin/www')
            .then(result => {
                console.log('Created bin/www file');
            });
        });
        
        //Create database configuration file
        var db_config_json = config['database-config'];
        var db_config = {
            username: db_config_json['username'],
            password: db_config_json['password'],
            database: db_config_json['database'],
            host: db_config_json['host'],
            port: db_config_json['port'],
            dialect: db_config_json['dialect'],
        }
        template_engine.template_creation('templates/config/config.json', db_config)
        .then(template => {
            file_creation.write_file(template, destination_folder + '/config/config.json')
            .then(result => {
                console.log('Created config/config.json file');
            });
        });

        //Create app.js file
        template_engine.template_creation('templates/app.js', {})
        .then(template => {
            file_creation.write_file(template, destination_folder + '/app.js')
            .then(result => {
                console.log('Created app.js file');
            });
        });
    });

program.parse(process.argv);