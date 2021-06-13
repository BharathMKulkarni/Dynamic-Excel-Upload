const express = require('express');
const UploadExcelToDb = require('../controller/employeeController.js');
const router = express.Router();

router.post("/excelupload", UploadExcelToDb);

module.exports = router;