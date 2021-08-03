const multer = require('multer');
const path = require('path');
const db = require("../models");
const Image= require('../models/history.js')(db.sequelize, db.Sequelize);

const excelFilter = async (req, file, cb) => {
   if (file.originalname.endsWith(".xlsx") || file.originalname.endsWith(".csv")) {
      console.log("FILE UPLOADED WAS EITHER .xlsx or .csv, OKAY!");
      cb(null, true);
      //inserting file names 
      await Image.create({
         Dtype: file.mimetype,
         name: file.originalname,
         uploaderId:req.user.uploaderId
       }).then((image) => {
      return res.send(`File has been uploaded.`);
    }).catch(()=>
    {
       console.log("samosa");
    })
   } else {
     cb("Please upload either .xlsx or .csv files", false);
   }
 };

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      console.log("hello");
      cb(null, path.resolve('uploads/'));
   },
   filename: (req, file, cb) => {
      console.log("world");
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
   }
});   
   
const upload = multer({storage: storage, fileFilter: excelFilter});

module.exports = upload;