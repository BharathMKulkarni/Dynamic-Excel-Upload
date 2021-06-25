const express = require('express');
const router = express.Router();
const {schema}=require('../models/schema/schema.js')
const userController=require('../controller/userController');



router.get("/table",userController.view);
router.get('/', (req, res) =>{
    res.render('excelpage',{
        show_tables:schema
    });
});
module.exports=router