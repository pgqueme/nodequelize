/**
 * Creates a template file
 */
function template_creation(route, params) {
    //Requires
    const fs = require('fs');
    const handlebars = require('handlebars');
    
    return new Promise(function(resolve, reject){
        //Get the template
        fs.readFile(route, 'utf8', (err, data) => {
            if (err){
                //Error reading the template
                console.log(err);
                reject(err);
            }
            else {
                //Compile the template
                const source = data;
                const template = handlebars.compile(source);
                const contents = template(params);
                resolve(contents);
            }
        });
    });
};

module.exports = { template_creation };