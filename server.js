const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const db = require('./models')
const employeeRouter = require('./routes/employeeRoute.js');

const app = express();

// setting the static folder (public), all css and frontend js go here
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.json());

// using the routes created
app.use("/employee", employeeRouter);

dotenv.config();

// Handlebars Setting
app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index'
}));

// Listening to port
const port = 4000;
// Sync model changes to database before starting app
db.sequelize.sync().then( req => {
    app.listen(port, () => {
        console.log(`App is running in port ${port}`);
        // createUsers(dummyUsers).then(result => {
        //     console.log("dummy users created hopefully!");
        // });
    });
});

// Landing Page
app.get('/', (req, res) => {
    res.send("Hello world");
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
