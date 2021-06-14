const express = require('express');
const upload = require('../config/multerConfig.js');
const UploadExcelToDb = require('../controller/employeeController.js');
const router = express.Router();

router.post("/excelupload", upload.single("file"), UploadExcelToDb);

module.exports = router;