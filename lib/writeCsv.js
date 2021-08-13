const fastcsv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const writeCsv = (data) => {
    const outputPath = path.resolve('uploads/' + `download${Date.now()}.csv`);
    const ws = fs.createWriteStream(outputPath);
    fastcsv
        .write(data, { headers: true })
        .pipe(ws);
    
    return new Promise( (resolve, reject) => {
        ws.on('finish', () => {
            resolve(outputPath);
        })
        .on('error', (error) => {
            reject(error);
        })
    });
}

module.exports = {writeCsv}