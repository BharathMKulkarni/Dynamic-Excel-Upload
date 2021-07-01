// REQUIRING NODE PACKAGES
const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');

// REQUIRING MODULES
const db = require('./models')
const userDataRouter = require('./routes/userDataRoute.js');
const viewRouter=require('./routes/viewRoute.js');
const {schema} = require('./models/schema/schema.js')

const app = express();
const port = process.env.PORT || 4001;

// SETTING THE STATIC FOLDER (public), ALL THE FRONTEND JS RESIDES HERE
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.use('/assets',express.static(__dirname + '/public/assets'))

// EXPRESS MIDDLEWARES
app.use(express.json());

// USING THE ROUTES CREATED
app.use("/userdata", userDataRouter);
app.use("/view",viewRouter);

dotenv.config();

// HANDLEBARS SETTINGS
app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + "/views/components"

}));

// LISTENING TO PORT AND SYNC MODEL CHANGES TO DATABASE BEFORE STARTING APP
db
.sequelize
.sync()
.then( req => {
    app.listen( port, () => { 
        console.log(`>>>App is running on port http://localhost:${port}`);
        //createUploaders(dummyUploaders).then(() => console.log("dummy uploaders created"));
    });
});

// HOME PAGE
app.get('/', (req, res) => {
    res.render('homePage',{
        documentTitle:"Dynamic-Excel-Upload/Home",
        cssPage: "homePage",
        dbCols: schema[0].columns
    });
});

app.get('/getcolumns', (req, res) => {
    res.status(200).json({data: schema[0].columns});
});


// Uncomment the lines below to add dummy users to your local db
// dummy users 
const dummyUploaders = [
    {
        phoneNo: "123456"
    },
    {
        phoneNo: "123455"
    },
    {
        phoneNo: "123454"
    }
]

// helper function to create dummy users 
const createUploaders = async (uploaders) => {
    const Uploader = db['uploader'];
    await Uploader.bulkCreate(uploaders);
}
