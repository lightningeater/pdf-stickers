
function readCodes() {
    const promise = new Promise((resolve, reject) => {
        //requiring path and fs modules
        const path = require('path');
        const fs = require('fs');
        //joining path of directory 
        const directoryPath = path.join(__dirname, '../qrcodegenerator/codes');
        //passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                reject(err);
                return console.log('Unable to scan directory: ' + err);
            }
            resolve(files.map(file => directoryPath + "/" + file));
        });
    });
    return promise;
}

//module.exports = { read: readCodes };
export default { read: readCodes };