//const readXlsxFile = require('read-excel-file/node');
const db = require('../models');
const Employee = require('../models/Employee.js')(db.sequelize, db.Sequelize);
const User = require('../models/Uploader.js')(db.sequelize, db.Sequelize);
const path = require('path');
const {parseExcel} = require('../lib/parseExcel');

const UploadExcelToDb = async (req, res) => {
    let filePath = path.resolve('uploads/' + req.file.filename);

    const userEmail = 'sam@gmail.com';
    let user;
    try {
        user = await User.findOne({
            where: { emailId: userEmail }
        });
    }
    catch(error) {
        console.log("couldn't find user/ db error");
    }

    try {
        let records = await parseExcel(filePath, req.body);
        records.forEach( row => {
            row.userId = user.userId;
        });
        const msg = await addRecords(records);
        res.status(200).json({message: msg});
    }
    catch(error) {
        res.status(200).json({message: "Error reading the file!"});
    }
}

// This function creates a transaction to add all records sent as argument to the database
// When more tables are added to schema this function can be generalised for all tables
const addRecords = async (records) => {
    const t = await db.sequelize.transaction();
    let line;
    try {
        line = 1;
        for(let entry of records) {
            console.log(entry);
            await Employee.create(entry, { transaction: t });
            line++;
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
        error.line = line;
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

