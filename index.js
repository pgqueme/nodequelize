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
    .command('create_file <text> <route>')
    .alias('cf')
    .description('Creates a file to the same folder')
    .action((text, route) => {
        template_engine.template_creation('templates/test', text)
        .then(template => {
            file_creation.write_file(template, route)
            .then(result => {
                console.log(result);
            });
        });
    });

program.parse(process.argv);