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

        template_engine.template_creation('templates/test', { title: config.port })
        .then(template => {
            file_creation.write_file(template, destination_folder + '/test.file')
            .then(result => {
                console.log(result);
            });
        });
    });

program.parse(process.argv);