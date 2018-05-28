"use strict";
{{extraDependencies}}
module.exports = function(sequelize, DataTypes) {
    var {{modelName}} = sequelize.define("{{modelName}}",
        {
            {{#fields}}
            {{name}}: { type: DataTypes.{{type}}, allowNull: {{allowNull}} },
            {{/fields}}
        },
        {
            timestamps: false,
            tableName: '{{tableName}}'
        }
    );
    {{modelName}}.associate = function(models) { 
        {{#associations}}
        {{../modelName}}.{{type}}(
            models.{{model}}{{#if foreignKey}},
            {
                foreignKey: '{{foreignKey}}'
            }
            {{/if}}
            {{#unless foreignKey}}

            {{/unless}}
        );
        {{/associations}}
    };
    return {{modelName}};
};

