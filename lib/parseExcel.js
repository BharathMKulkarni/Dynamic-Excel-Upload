const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const XLSX = require('xlsx');

const parseExcel = (filePath, dbColMapping) => {
    console.log("EXECUTING parseExcel() from parseExcel.js FILE");
    // Check if file is xls and convert to csv if true (using xlsx library)
    if(filePath.endsWith(".xls") || filePath.endsWith(".xlsx")) {
        console.log("CHECKING IF the file ends with .xls or .xlsx");
        let output_file_name = path.resolve('uploads/out.csv');
        console.log("ATTEMPTING TO READ FILE ");
        let workbook = XLSX.readFile(filePath);
        console.log("READ FILE AND CREATED THE workbook OBJECT");
        let stream = XLSX.stream.to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        console.log("CONVERTED THE XLSX TO CSV");
        stream.pipe(fs.createWriteStream(output_file_name));
        console.log("EXECUTED stream.pipe()");
        let xlsFilePath = filePath;
        // fs.unlink(xlsFilePath, err => {
        //     console.log("INSIDE fs.unlink()");
        //     if(err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(xlsFilePath + " deleted");
        //     }
        // });
        // changing file path to the converted csv file
        filePath = output_file_name;
    }

    // Map of Columns of database to excel file
    //let dbColMapping = req.body;
    console.log(`THE DB AND EXCEL-COLUMN MAPPING IS:\n${dbColMapping}`);
    let records = [];

    return new Promise( (resolve, reject) => {
        fs.createReadStream(filePath).pipe(csv.parse({headers: true, ignoreEmpty: true}))
            .on("error", (error) => {
                reject(error);
            })
            .on("data", (row) => {
                let entry = {};
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
                    else {
                        console.log(filePath + " deleted");
                    }
                });
                resolve(records);
            });
    });
}

module.exports = {parseExcel}