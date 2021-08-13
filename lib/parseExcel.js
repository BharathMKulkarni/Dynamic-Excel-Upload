const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const XLSX = require('xlsx');

//TODO: rememeber to remove all console logs
const parseExcel = (filePath, dbColMapping, sheetNo) => {
    // Check if file is xls and convert to csv if true (using xlsx library)
    if(filePath.endsWith(".xls") || filePath.endsWith(".xlsx") || filePath.endsWith(".csv")) {

        let output_file_name = path.resolve(`uploads/csv-${Date.now()}.csv`);
        let workbook = XLSX.readFile(filePath);
        let stream = XLSX.stream.to_csv(workbook.Sheets[workbook.SheetNames[sheetNo-1]]);
        var writeStreamToCsv = fs.createWriteStream(output_file_name);
        stream.pipe(writeStreamToCsv);

        let xlsFilePath = filePath;
        fs.unlink(xlsFilePath, err => {
            if(err) {
                console.log(err);
            }
        });
        //changing file path to the converted csv file
        filePath = output_file_name;
    }

    // Map of Columns of database to excel file
    //let dbColMapping = req.body;
    console.log(dbColMapping);
    let records = [];

    return new Promise( (resolve, reject) => {
        writeStreamToCsv.on('finish', () => {

            fs.createReadStream(filePath).pipe(csv.parse({headers: true, ignoreEmpty: true}))
                .on("error", (error) => {
                    reject(error);
                })
                .on("data", (row) => {
                    let entry = {};
                    for(let colName in row) {
                        if(colName !== colName.trim())
                            row[colName.trim()] = row[colName]
                    }
                    for(const col in dbColMapping) {
                        entry[col] = row[dbColMapping[col]] || null;
                    }
                    records.push(entry);
                })
                .on("end", () => {
                    fs.unlink(filePath, err => {
                        if(err) {
                            console.log(err);
                        }
                    });
                    resolve(records);
                });
        });
    });
}

module.exports = {parseExcel}