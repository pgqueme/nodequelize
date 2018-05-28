/**
 * Writes a file to the specified folder inside the current route.
 */
function writeFile(text, route) {
    //File system requires
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var getDirName = require('path').dirname;

    return new Promise(function(resolve, reject){
        //Check if the folder exists, if not, create it
        mkdirp(getDirName(route), function (err) {
            if (err){
                //Error creating folder
                console.log(err);
                reject(null);
            }
            else {
                //Write to the file
                fs.writeFile(route, text, { flags: 'wx' }, function(err) {
                    if(err) {
                        //Error writing to file
                        console.log(err);
                        reject(null);
                    }
                    else {
                        resolve('Done writing file');
                    }
                }); 
            }
        });
    });
}

module.exports = { writeFile };