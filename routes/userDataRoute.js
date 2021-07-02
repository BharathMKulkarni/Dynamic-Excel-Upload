const express = require('express');
const upload = require('../config/multerConfig.js');
const { UploadExcelToDb } = require('../controller/userDataController.js');
const router = express.Router();
const {isAuth} = require('../controller/authMiddleware');

router.post("/upload", isAuth, upload.single("file"), UploadExcelToDb);

module.exports = router;