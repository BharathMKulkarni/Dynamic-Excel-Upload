const express = require('express');
const router = express.Router();
const {schema}=require('../models/schema/schema.js')
const getUserData = require('../controller/userDataController').getUserData;

router.get("/table", getUserData);
router.get('/', (req, res) =>{
    res.render('viewSchema',{
        show_tables: schema
    });
});
module.exports = router