//const readXlsxFile = require('read-excel-file/node');
const db = require('../models');
const Employee = require('../models/Employee.js')(db.sequelize, db.Sequelize);
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const XLSX = require('xlsx');

const UploadExcelToDb = async (req, res) => {
    let filePath = path.resolve('uploads/' + req.file.filename);

    // Check if file is xls and convert to csv if true (using xlsx library)
    if(filePath.endsWith(".xls") || filePath.endsWith(".xlsx")) {
        let output_file_name = path.resolve('uploads/out.csv');
        let workbook = XLSX.readFile(filePath);
        let stream = XLSX.stream.to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        stream.pipe(fs.createWriteStream(output_file_name));
        let xlsFilePath = filePath;
        fs.unlink(xlsFilePath, err => {
            if(err) {
                console.log(err);
            }
            else {
                console.log(xlsFilePath + " deleted");
            }
        });
        // changing file path to the converted csv file
        filePath = output_file_name;
    }

    // Map of Columns of database to excel file
    let dbColMapping = req.body;
    console.log(dbColMapping);
    let records = [];

    try {
        fs.createReadStream(filePath).pipe(csv.parse({headers: true, ignoreEmpty: true}))
        .on("error", (error) => {
            throw error;
        })
        .on("data", (row) => {
            let entry = {};
            for(const col in dbColMapping) {
                entry[col] = row[dbColMapping[col]] || null;
            }
            records.push(entry);
        })
        .on("end", async () => {
            let msg = await addRecords(records);
            console.log(msg);
            fs.unlink(filePath, err => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(filePath + " deleted");
                }
            });
            res.status(200).json({message: msg});
        });
    }
    catch(error) {
        console.log("error while reading excel file: " + error);
        return;
    }
}

// This function creates a transaction to add all records sent as argument to the database
// When more tables are added to schema this function can be generalised for all tables
const addRecords = async (records) => {
    const t = await db.sequelize.transaction();
    try {
        for(let entry of records) {
            console.log(entry);
            await Employee.create(entry, { transaction: t });
        }
        // If the execution reaches this line, the transaction has been committed successfully
        // `result` is whatever was returned from the transaction callback
        await t.commit();
        return "Successfully Uploaded!";
    } catch (error) {
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
        await t.rollback();
        console.log("Transaction rolled back!");
        console.log(error);
        return error;
    }
}

module.exports = { UploadExcelToDb };

// Ignore the code below, it works only for excel files using a different library
// I've commented it for now just to keep as backup, it can be deleted once the new api
// written above is tested thoroughly

// const UploadExcelToDb = async (req, res) => {
//     console.log("works!");

//     let filePath = path.resolve('uploads/' + req.file.filename);
//     // Map of Columns of database to excel file
//     let dbColMapping = req.body;
//     console.log(dbColMapping);
//     let rows;
//     let excelColumns = {};
//     try {
//         rows = await readXlsxFile(filePath);
//         console.log("reading done");
//         console.log(rows);
//         for(let i = 0; i < rows[0].length; i++) {
//             // Mapping each column name in excel file to index
//             excelColumns[rows[0][i]] = i;
//         }
//         rows.shift(); // remove column head
//     }
//     catch(error) {
//         console.log("error while reading excel file: " + error);
//         return;
//     }
//     fs.unlink(filePath, err => {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             console.log(filePath + " deleted");
//         }
//     });

//     // Transaction to add all rows from excel file to database
//     const t = await db.sequelize.transaction();
//     try {
//         for(let i = 0; i < rows.length; i++) {
//             await Employee.create({
//                 name: rows[i][excelColumns[dbColMapping.name]],
//                 salary: rows[i][excelColumns[dbColMapping.salary]],
//                 age: rows[i][excelColumns[dbColMapping.age]]
//             }, { transaction: t });
//         }
//         // If the execution reaches this line, the transaction has been committed successfully
//         // `result` is whatever was returned from the transaction callback
//         await t.commit();
//         res.status(201).json({message: "Success!"});
//     } catch (error) {
//         // If the execution reaches this line, an error occurred.
//         // The transaction has already been rolled back automatically by Sequelize!
//         await t.rollback();
//         console.log("Transaction rolled back!");
//         console.log(error);
//         res.status(500).json({message: error});
//     }
// }

