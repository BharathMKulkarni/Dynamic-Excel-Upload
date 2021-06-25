const mysql=require('mysql2');
const config = require('../config/config.json');
require('dotenv').config();

const pool=mysql.createPool({
    connectionLimit :100,
    host            :process.env.DB_HOST,
    user            :process.env.DB_USER,
    password         :process.env.DB_PASSWORD,
    database        :process.env.DB_NAME
});

//connect to db

//view
exports.view = (req,res)=>
{
 pool.getConnection((err,connection)=>
{
    if(err)
    throw err;
    console.log('Connected as ID '+connection.threadId);
   // console.log(connection)

    //use the connection
    connection.query('SELECT * FROM user_data  where uploader_id="1e744253-d571-11eb-ab67-3065ecc5243e" ',(err,rows)=> {
        connection.release();
        if(!err){
            console.log("broo");
            res.render('home',{ rows });
        }else
        {
           res.render("home");
            console.log(err);
        }
        //console.log(rows);
    });
});
}

