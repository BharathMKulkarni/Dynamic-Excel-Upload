// REQUIRING NODE PACKAGES
const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const fs = require('fs');
const session = require('express-session');
var passport = require('passport');
const cors = require('cors');

// USING ENV FILE 
dotenv.config();

// Creating uploads directory to store all uploaded files temporarily
if(!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

// REQUIRING MODULES
const db = require('./models')
const userDataRouter = require('./routes/userDataRoute');
const viewRouter=require('./routes/viewRoute');
const loginRouter = require('./routes/loginRoute');
const {schema} = require('./models/schema/schema')
const {isAuth} = require('./controller/authMiddleware')

const app = express();
const port = process.env.PORT || 4003;

// SETTING THE STATIC FOLDER (public), ALL THE FRONTEND JS RESIDES HERE
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/assets',express.static(__dirname + '/public/assets'))

// EXPRESS MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// ------------ HANDLEBARS SETTINGS ---------------
app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + "/views/components"
}));


// -------------- SESSION SETUP ----------------

const sessionStore = new SequelizeStore({
    db: db.sequelize
});

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

// -------------- PASSPORT AUTHENTICATION --------------

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

// USING THE ROUTES CREATED
app.use("/userdata", isAuth, userDataRouter);
app.use("/view", isAuth, viewRouter);
app.use("/login", loginRouter);
app.use("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
})

// HOME PAGE
app.get('/home', isAuth, (req, res) => {
    res.render('homePage',{
        documentTitle:"Dynamic-Excel-Upload/Home",
        cssPage: "homePage",
        dbCols: schema
    });
});

app.get('/', (req, res) => {
    res.render('loginPage', {
        documentTitle:"Dynamic-Excel-Upload/Login",
        cssPage: "loginPage"
    });
});

app.get('/getcolumns', (req, res) => {
    res.status(200).json({data: schema[0].columns});
});

// LISTENING TO PORT AND SYNC MODEL CHANGES TO DATABASE BEFORE STARTING APP
db
.sequelize
.sync()
.then( req => {
    app.listen( port, () => { 
        console.log(`>>>App is running on port http://localhost:${port}`);
    });
});


