const db = require('../models');
const UserData = require('../models/UserExcelData.js')(db.sequelize, db.Sequelize);
const path = require('path');
const fs = require('fs');
const {schema} = require('../models/schema/schema');
const {parseExcel} = require('../lib/parseExcel');
const {writeCsv} = require('../lib/writeCsv');
const {Op}=require('sequelize');
const History = require('../models/History.js')(db.sequelize, db.Sequelize);

const UploadExcelToDb = async (req, res) => {
    let filePath = path.resolve('uploads/' + req.file.filename);

    try {
        let sheetNo = req.body.sheetNo;
        delete req.body.sheetNo;
        let records = await parseExcel(filePath, req.body, sheetNo);
        records.forEach( row => {
            row.uploaderId = req.user.uploaderId;
            row.EId = req.fileId;
        });
        const msg = await addRecords(records, req.fileId);
        res.status(200).json(msg);
    } catch(error) {
        res.status(200).json({message: "Error reading the file!"});
        return;
    }
}

// This function creates a transaction to add all records sent as argument to the database
// When more tables are added to schema this function can be generalised for all tables
const addRecords = async (records, fileId) => {

    const t = await db.sequelize.transaction();
    try {
        var line = 1;
        for(let entry of records) {
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
        try {
            await History.destroy({
                where: { EId: fileId }
            });
        }
        catch(error) {
            return;
        }
        const uiError = {}
        switch(error.name) {
            case 'SequelizeUniqueConstraintError': 
                uiError.message = "Data in the file has possible duplicate values which might have been uploaded from another file.";
                break;
            case 'SequelizeValidationError':
                uiError.message = "An error occured while validating file data. This error can occur if a mandatory column is not mapped or a necessary field is not empty";
                break;
            default: 
                uiError.message = "An error occured. Please make sure if the file data is valid."
        }
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

const GetHistory = async (req, res) => {

    let fileList;
    try {
        fileList = await History.findAll({
            raw: true,
            where: {
                uploaderId: req.user.uploaderId,
            },
            order: [
                ['e_id', 'DESC']
            ],
        });
    }
    catch(error) {
        res.status(500).json({message: error});
        return;
    }
    res.render('history',{ 
        documentTitle:"Dynamic-Excel-Upload/History",
        cssPage: "viewtable",
        rows: fileList,
    });
 }

const DeleteHistory = async (req, res) => {

    const t = await db.sequelize.transaction();
    try {
        await UserData.destroy({
            where: {
                EId: req.params['EId'],
                uploaderId: req.user.uploaderId
            }
        }, { transaction: t });
   
        await History.destroy({
            where: {
                EId: req.params['EId']
            }
        }, { transaction: t });

        await t.commit();
    }
    catch(error) {
        await t.rollback();
        console.log(error);
        res.status(403).json({message: "Error while deleting file entry"});
        return;
    }

    res.redirect('/userdata/history');
}

const DownloadFile = async (req, res) => {
    try {
        let data = await UserData.findAll({
            raw: true,
            where: {
                EId: req.params['EId'],
                uploaderId: req.user.uploaderId
            }
        });

        data.forEach(row => {
            delete row.EId;
            delete row.id;
            delete row.deletedFlag;
            delete row.uploaderId;
        });

        var outputPath = await writeCsv(data);

        const file = fs.createReadStream(outputPath)
        const filename = (new Date()).toISOString()
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename + '.csv');
        res.setHeader('Content-Type', 'text/csv');
        file.pipe(res)
        .on("finish", () => {
            fs.unlink(outputPath, err => {
                if(err) {
                    console.log(err);
                }
            });
        });
    }
    catch(error) {

    }
}

module.exports = {UploadExcelToDb, DeleteUserData, GetUserData, GetHistory, DeleteHistory, DownloadFile};