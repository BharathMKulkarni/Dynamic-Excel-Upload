//const readXlsxFile = require('read-excel-file/node');
const db = require('../models');
const UserData = require('../models/UserExcelData.js')(db.sequelize, db.Sequelize);
//const Uploader = require('../models/Uploader.js')(db.sequelize, db.Sequelize);
const path = require('path');
const {schema} = require('../models/schema/schema');
const {parseExcel} = require('../lib/parseExcel');
const {Op}=require('sequelize');
const Uploader = require('../models/history.js')(db.sequelize, db.Sequelize);

const UploadExcelToDb = async (req, res) => {
    console.log("EXECUTING uploadExcelToDb() from userDataController.js");
    console.log(`\n\n\nBODY OF THE REQUEST:\n${req.file.filename}`);
    let filePath = path.resolve('uploads/' + req.file.filename);

    try {
        //Pkey is variable which stores latest entry of excel sheet
        let Pkey;
        console.log("TRYING TO RECEIVE THE RECORDS ARRAY FROM parseExcel()")
        let sheetNo = req.body.sheetNo;
        delete req.body.sheetNo;
        let records = await parseExcel(filePath, req.body, sheetNo);
        console.log("RECORDS RECEIVED");
        //gets the latest entry from image table where we store file names
        try{
            let eid;
            eid=await Uploader.findOne({
                row:true,
                limit:1,
                where: { uploaderId:req.user.uploaderId },
                order: [ [ 'e_id', 'DESC' ]] 
            }
                
            )
            Pkey=eid.EId;
            console.log(Pkey);
   
            
        }
        catch(error) {
            console.log(error);
        }
        records.forEach( row => {
            row.uploaderId = req.user.uploaderId;
            row.EId=Pkey;
            console.log(row.EId)
        });
        console.log("uploaderID ADDED TO EACH RECORD");
        const msg = await addRecords(records,Pkey);
        console.log("EXECUTED addRecords() SUCCESSFULLY");
        res.status(200).json(msg);
    } catch(error) {
        res.status(200).json({message: "Error reading the file!"});
        return;
    }
}

// This function creates a transaction to add all records sent as argument to the database
// When more tables are added to schema this function can be generalised for all tables
const addRecords = async (records,Pkey) => {
    console.log("adding records")
    const t = await db.sequelize.transaction();
    
    try {
        var line = 1;
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
        //rollback 
        try{
            await Uploader.destroy({
                where: {
                  EId: Pkey
                }
              });
        }
        catch(error)
        {
            console.log("sorry ji");
            return
        }
        console.log("Transaction rolled back!");
        const uiError = {}
        switch(error.name) {
            case 'SequelizeUniqueConstraintError': 
                uiError.message = "Data in the file has possible duplicate values which might have been uploaded from another file.";
                break;
            case 'SequelizeValidationError':
                uiError.message = "An error occured while validating file data. This error can occur if a mandatory column is not mapped.";
                break;
            default: 
                uiError.message = "An error occured. Please make sure if the file data is valid."
        }
        console.log(error.name);
        uiError.line = line;
        return uiError;
    }
}

const DeleteUserData = async (req, res) => {
    try {
        await UserData.update({ deletedFlag: 'inactive' },
        {
            where: {
                phone: req.body.phone || null,
                deletedFlag: 'active',
                uploaderId: req.user.uploaderId
            }
        });
    }
    catch(error) {
        res.status(403).json({message: "Error while deleting"});
        return;
    }
    res.status(200).json({message: "Deleted successfully"});
}

const GetUserData = async (req, res) => {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
        page = pageAsNumber;
    }

    let size = 10;
    if(!Number.isNaN(sizeAsNumber) && !(sizeAsNumber > 10) && !(sizeAsNumber < 1)){
        size = sizeAsNumber;
    }

    var pattern = req.body.search;

    let userDataList;
    try {
        userDataList = await UserData.findAndCountAll({
            limit: size,
            offset: page * size,
            raw:true,
            where: {
                [Op.or]:{
                    firstName: { [Op.like]: `%${pattern}%` },
                    lastName: { [Op.like]: `%${pattern}%` },
                    userType: { [Op.like]: `%${pattern}%` },
                    phone: { [Op.like]: `%${pattern}%` },
                    email: { [Op.like]: `%${pattern}%` },
                    userPassword: { [Op.like]: `%${pattern}%` },
                    userStatus: { [Op.like]: `%${pattern}%` },
                    mobile: { [Op.like]: `%${pattern}%` },
                },
                uploaderId: req.user.uploaderId,
                deletedFlag: 'active'
            }
        });
    }
    catch(error) {
        res.status(500).json({message: error});
        return;
    }
    let columns = []
    schema.forEach(col => {
        columns.push(col.name);
    })
    columns.push("createdAt");

    res.status(200).json({
        data: userDataList.rows, 
        columns: columns, 
        totalPages: Math.ceil(userDataList.count / Number.parseInt(size))
    });
}
const getUser = async (req, res) => {

    let userDataList;
    try {
        userDataList = await Uploader.findAll({
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
    res.render('history',{ 
        documentTitle:"Dynamic-Excel-Upload/Delete",
        cssPage: "viewtable",
        rows: userDataList,
    });
 }

const DeleteUser = async (req, res) => {
    try {
        await UserData.destroy({
            where: {
                e_id:req.params['EId']
            }
        });
    }
    catch(error) {
        console.log(error)
        res.status(403).json({message: "Error while deleting"});
        return;
    }
    try {
        await Uploader.destroy({
            where: {
                e_id:req.params['EId']
            }
        });
    }
    catch(error) {
        console.log(error)
        res.status(403).json({message: "Error while deleting"});
        return;
    }
    res.redirect('/userdata/history');
}
module.exports = {UploadExcelToDb, DeleteUserData, GetUserData,getUser,DeleteUser};