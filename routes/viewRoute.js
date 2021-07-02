const express = require('express');
const router = express.Router();
const {schema}=require('../models/schema/schema.js')
const getUserData = require('../controller/userDataController').getUserData;
const {isAuth} = require('../controller/authMiddleware');

router.get("/table", isAuth, getUserData);

router.get('/', isAuth, (req, res) =>{
    res.render('viewSchema',{
        show_tables: schema
    });
});

module.exports = router