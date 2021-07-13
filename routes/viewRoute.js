const express = require('express');
const router = express.Router();
const {schema}=require('../models/schema/schema.js')
const getUserData = require('../controller/userDataController').getUserData;
const {isAuth} = require('../controller/authMiddleware');
const DeleteUserData = require('../controller/userDataController').DeleteUserData;
const FindUser = require('../controller/userDataController').FindUser;

router.get("/table", isAuth, getUserData);
router.get('/table/:id',isAuth,DeleteUserData);
router.post('/table',isAuth,FindUser);

router.get('/', isAuth, (req, res) =>{
    res.render('viewSchema',{
        documentTitle:"Dynamic-Excel-Upload/ViewSchema",
        show_tables: schema
    });
});

module.exports = router