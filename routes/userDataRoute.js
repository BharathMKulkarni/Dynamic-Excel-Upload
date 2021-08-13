const express = require('express');
const upload = require('../config/multerConfig.js');
const { UploadExcelToDb } = require('../controller/userDataController.js');
const DeleteUserData = require('../controller/userDataController').DeleteUserData;
const router = express.Router();
const {isAuth} = require('../controller/authMiddleware');
const keys = require('../models/schema/schema').keys;
const GetHistory = require('../controller/userDataController').GetHistory;
const DeleteHistory = require('../controller/userDataController').DeleteHistory;
const DownloadFile = require('../controller/userDataController').DownloadFile;


router.post("/upload", isAuth, upload.single("file"), UploadExcelToDb);
router.post("/delete", isAuth, DeleteUserData);

router.get('/history/:EId', isAuth, DeleteHistory);
router.get("/history", isAuth, GetHistory);
router.get("/download/:EId", isAuth, DownloadFile);

router.get("/key", isAuth, (req, res) => {
    res.status(200).json({data: keys["userData"]})
})

module.exports = router;