const readXlsxFile = require('read-excel-file/node');
const db = require('../models');
const Employee = require('../models/Employee.js')(db.sequelize, db.Sequelize);
const path = require('path');
const fs = require('fs');

const UploadExcelToDb = async (req, res) => {
    console.log("works!");

    let filePath = path.resolve('uploads/' + req.file.filename);
    // Map of Columns of database to excel file
    let dbColMapping = req.body;
    console.log(dbColMapping);
    let rows;
    let excelColumns = {};
    try {
        rows = await readXlsxFile(filePath);
        console.log("reading done");
        console.log(rows);
        for(let i = 0; i < rows[0].length; i++) {
            // Mapping each column name in excel file to index
            excelColumns[rows[0][i]] = i;
        }
        rows.shift(); // remove column head
    }
    catch(error) {
        console.log("error while reading excel file: " + error);
        return;
    }
    fs.unlink(filePath, err => {
        if(err) {
            console.log(err);
        }
        else {
            console.log(filePath + " deleted");
        }
    });

    try {
        // Transaction to add all rows from excel file to database
        const result = await db.sequelize.transaction(async (t) => {
            for(let i = 0; i < rows.length; i++) {
                await Employee.create({
                    name: rows[i][excelColumns[dbColMapping.name]],
                    salary: rows[i][excelColumns[dbColMapping.salary]],
                    age: rows[i][excelColumns[dbColMapping.age]]
                });
            }
        });
        // If the execution reaches this line, the transaction has been committed successfully
        // `result` is whatever was returned from the transaction callback
        res.status(201).json({message: "Success!"});
    } catch (error) {
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
        console.log("Transaction rolled back!");
        console.log(error);
        res.status(500).json({message: error});
    }
}

module.exports = UploadExcelToDb;