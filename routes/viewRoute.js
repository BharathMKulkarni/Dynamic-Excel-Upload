const express = require('express');
const router = express.Router();
const {schema}=require('../models/schema/schema.js');
const {isAuth} = require('../controller/authMiddleware');
const GetUserData = require('../controller/userDataController').GetUserData;

router.get("/table", isAuth, (req, res) => {
    res.render('viewTable',{ 
        documentTitle:"Dynamic-Excel-Upload/ViewUserTable",
        cssPage: "viewtable",
        columns: schema
    });
});
router.post('/table/search',isAuth, GetUserData);

router.get('/', isAuth, (req, res) =>{
    res.render('viewSchema',{
        documentTitle:"Dynamic-Excel-Upload/ViewSchema",
        show_tables: schema
    });
});

module.exports = router