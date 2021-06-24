// REQUIRING NODE PACKAGES
const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');

// REQUIRING MODULES
const db = require('./models')
<<<<<<< HEAD
const employeeRouter = require('./routes/employeeRoute.js');
const viewRouter=require('./routes/viewRoute.js');

=======
const userDataRouter = require('./routes/userDataRoute.js');
const viewRouter=require('./routes/viewRoute.js')
>>>>>>> 6643f1e78d03616db71c62fb8f65cf6722e36850
const app = express();
const port = process.env.PORT || 4000;

// SETTING THE STATIC FOLDER (public), ALL THE FRONTEND JS RESIDES HERE
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

// EXPRESS MIDDLEWARES
app.use(express.json());

<<<<<<< HEAD
// USING THE ROUTES CREATED
app.use("/employee", employeeRouter);
=======
// using the routes created
app.use("/userdata", userDataRouter);
>>>>>>> 6643f1e78d03616db71c62fb8f65cf6722e36850
app.use("/view",viewRouter);
dotenv.config();

// Handlebars Setting
app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + "/views/components"

}));

<<<<<<< HEAD
// LISTENING TO PORT AND SYNC MODEL CHANGES TO DATABASE BEFORE STARTING APP
db
.sequelize
.sync()
.then( req => {
    app.listen( port, () => console.log(`>>>App is running in port ${port}`) );
=======
// Listening to port
const port = 4000;
// Sync model changes to database before starting app
db.sequelize.sync({force: true}).then( req => {
    app.listen(port, () => {
        console.log(`App is running in port ${port}`);
        // createUsers(dummyUsers).then(result => {
        //     console.log("dummy users created hopefully!");
        // });
    });
>>>>>>> 6643f1e78d03616db71c62fb8f65cf6722e36850
});

// HOME PAGE
app.get('/', (req, res) => {
    res.render('homePage',{
        documentTitle:"Dynamic-Excel-Upload/Home",
        cssPage: "homePage",
        dbCols: ["teamID","Names","phoneNo","emailID","Title"]
    });
});


// Uncomment the lines below to add dummy users to your local db
// // dummy users 
// const dummyUsers = [
//     {
//         name: "max",
//         emailId: "max@gmail.com",
//         phoneNo: "123456"
//     },
//     {
//         name: "sam",
//         emailId: "sam@gmail.com",
//         phoneNo: "123455"
//     },
//     {
//         name: "joe",
//         emailId: "joe@gmail.com",
//         phoneNo: "123454"
//     }
// ]
// // helper function to create dummy users 
// const createUsers = async (users) => {
//     const User = db['user'];
//     await User.bulkCreate(users);
// }
