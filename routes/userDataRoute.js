const express = require('express');
const upload = require('../config/multerConfig.js');
const { UploadExcelToDb } = require('../controller/userDataController.js');
const DeleteUserData = require('../controller/userDataController').DeleteUserData;
const router = express.Router();
const {isAuth} = require('../controller/authMiddleware');

router.post("/upload", isAuth, upload.single("file"), UploadExcelToDb);
router.post("/delete", isAuth, DeleteUserData);

module.exports = router;