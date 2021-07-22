const express = require('express');
const router = express.Router();
const {schema}=require('../models/schema/schema.js')
const getUserData = require('../controller/userDataController').getUserData;
const {isAuth} = require('../controller/authMiddleware');
const FindUser = require('../controller/userDataController').FindUser;

router.get("/table", isAuth, getUserData);
router.post('/table/search',isAuth, FindUser);
router.get("/table/key", isAuth, (req, res) => {
    res.status(200).json({data: keys["userData"]})
})

router.get('/', isAuth, (req, res) =>{
    res.render('viewSchema',{
        documentTitle:"Dynamic-Excel-Upload/ViewSchema",
        show_tables: schema
    });
});

module.exports = router