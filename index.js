#!/usr/bin/env node
const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const file_creation = require('./file_creation');

program
    .version('0.0.1')
    .description('NodeJS REST API generator using Express and Sequelize');

program
    .command('hello <param1> <param2>')
    .alias('h')
    .description('Hello world test')
    .action((param1, param2) => {
        file_creation.print(param1);
        file_creation.print(param2);
    }
);

program.parse(process.argv);