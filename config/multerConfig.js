const multer = require('multer');
const path = require('path');
const db = require("../models");
const History = require('../models/History.js')(db.sequelize, db.Sequelize);

const excelFilter = async (req, file, cb) => {
   if (file.originalname.endsWith(".xlsx") || file.originalname.endsWith(".csv")) {
      //inserting file names 
      try {
         var fileObj = await History.create({
            Dtype: file.mimetype,
            name: file.originalname,
            uploaderId: req.user.uploaderId
         });
      }
      catch(error) {
         return;
      }
      req.fileId = fileObj.EId;
      cb(null, true);
   } else {
     cb("Please upload either .xlsx or .csv files", false);
   }
 };

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.resolve('uploads/'));
   },
   filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
   }
});   
   
const upload = multer({storage: storage, fileFilter: excelFilter});

module.exports = upload;