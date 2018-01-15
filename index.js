#!/usr/bin/env node
//CLI interface package
const program = require('commander');
//Methods for writing files
const file_creation = require('./file_creation');

//Version command
program
    .version('0.0.3')
    .description('NodeJS REST API generator using Express and Sequelize');

//Hello world test command
program
    .command('hello <param1> <param2>')
    .alias('h')
    .description('Hello world test')
    .action((param1, param2) => {
        file_creation.print(param1);
        file_creation.print(param2);
    });

program
    .command('create_file <text> <route>')
    .alias('cf')
    .description('Creates a file to the same folder')
    .action((text, route) => {
        file_creation.write_file(text, route);
    });

program.parse(process.argv);