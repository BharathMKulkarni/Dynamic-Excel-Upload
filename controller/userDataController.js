//const readXlsxFile = require('read-excel-file/node');
const db = require('../models');
const UserData = require('../models/UserExcelData.js')(db.sequelize, db.Sequelize);
const Uploader = require('../models/Uploader.js')(db.sequelize, db.Sequelize);
const path = require('path');
const {schema} = require('../models/schema/schema');
const {parseExcel} = require('../lib/parseExcel');
const {Op}=require('sequelize');

const UploadExcelToDb = async (req, res) => {
    console.log("EXECUTING uploadExcelToDb() from userDataController.js");
    console.log(`\n\n\nBODY OF THE REQUEST:\n${req.file.filename}`);
    let filePath = path.resolve('uploads/' + req.file.filename);

    try {
        console.log("TRYING TO RECEIVE THE RECORDS ARRAY FROM parseExcel()")
        let records = await parseExcel(filePath, req.body);
        console.log("RECORDS RECEIVED");
        records.forEach( row => {
            row.uploaderId = req.user.uploaderId;
        });
        console.log("uploaderID ADDED TO EACH RECORD");
        const msg = await addRecords(records);
        console.log("EXECUTED addRecords() SUCCESSFULLY");
        res.status(200).json(msg);
    } catch(error) {
        res.status(200).json({message: "Error reading the file!"});
        return;
    }
}

// This function creates a transaction to add all records sent as argument to the database
// When more tables are added to schema this function can be generalised for all tables
const addRecords = async (records) => {
    console.log("adding records")
    const t = await db.sequelize.transaction();
    let line;
    try {
        line = 1;
        for(let entry of records) {
            console.log(entry);
            await UserData.create(entry, { transaction: t });
            line++;
        }
        // If the execution reaches this line, the transaction has been committed successfully
        // `result` is whatever was returned from the transaction callback
        await t.commit();
        return {message: "Successfully Uploaded!"};
    } catch (error) {
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
        await t.rollback();
        console.log("Transaction rolled back!");
        const uiError = {}
        switch(error.name) {
            case 'SequelizeUniqueConstraintError': 
                uiError.message = "Possible duplicate value has been detected";
                break;
            case 'SequelizeValidationError':
                uiError.message = "Please check the type of data entered";
                break;
            default: 
                uiError.message = "An error occured. Please check the data entered"
        }
        console.log(error.name);
        uiError.line = line;
        return uiError;
    }
}

const getUserData = async (req, res) => {

    let userDataList;
    try {
        userDataList = await UserData.findAll({
            raw: true,
            where: {
                uploaderId: req.user.uploaderId
            }
        });
    }
    catch(error) {
        res.status(500).json({message: error});
        return;
    }
    console.log(userDataList);
    res.render('viewTable',{ 
        documentTitle:"Dynamic-Excel-Upload/ViewUserTable",
        rows: userDataList,
        columns: schema
    });
 }

 const DeleteUserData = async (req, res) => {


    try{
        await UserData.destroy({
            where: {
              id: req.params['id']
            }
          });
    }
    catch(error)
    {
        console.log("sorry ji");
        return
    }
    res.redirect('/view/table');
 }

 const FindUser = async (req, res) => {
     var item=req.body.search;
     console.log(item);

    let userDataList;
    try {
        userDataList = await UserData.findAll({
            raw:true,
            where: {
               [Op.or]:{
                   firstName:item,
                   lastName:item,
                   userType:item


               }
                
            }
        });
    }
    catch(error) {
        console.log("illa");
        res.status(500).json({message: error});
        return;
    }
    console.log(userDataList);
    console.log("hello",schema.name)
    res.render('viewTable',{ 
        documentTitle:"Dynamic-Excel-Upload/ViewUserTable",
        rows: userDataList,
        columns: schema
    });
 }

module.exports = { UploadExcelToDb, getUserData,DeleteUserData,FindUser};