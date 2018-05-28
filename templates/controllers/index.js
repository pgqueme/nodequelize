{{#models}}
const {{modelName}}Controller = require('./{{modelName}}');
{{/models}}

module.exports = {
    {{#models}}
    {{modelName}}Controller,
    {{/models}}
};