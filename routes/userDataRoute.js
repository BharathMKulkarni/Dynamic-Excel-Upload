const express = require('express');
const upload = require('../config/multerConfig.js');
const { UploadExcelToDb } = require('../controller/userDataController.js');
const DeleteUserData = require('../controller/userDataController').DeleteUserData;
const router = express.Router();
const {isAuth} = require('../controller/authMiddleware');
const keys = require('../models/schema/schema').keys;

router.post("/upload", isAuth, upload.single("file"), UploadExcelToDb);
router.post("/delete", isAuth, DeleteUserData);
router.get("/key", isAuth, (req, res) => {
    res.status(200).json({data: keys["userData"]})
})

module.exports = router;