/**
 * Prints specified text to the Console.
 */
print = (param1) => {
    console.log(param1);
};

/**
 * Writes a file to the specified folder inside the current route.
 */
write_file = (text, route) => {
    //File system requires
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var getDirName = require('path').dirname;

    //Check if the folder exists, if not, create it
    mkdirp(getDirName(route), function (err) {
        if (err){
            //Error creating folder
            console.log(err);
            return err;
        }
            
        //Write to the file
        fs.writeFile(route, text, { flags: 'wx' }, function(err) {
            if(err) {
                //Error writing to file
                console.log(err);
                return err;
            }
            else {
                console.log('done');
                return true;
            }
        }); 
    });

}

module.exports = { print, write_file };