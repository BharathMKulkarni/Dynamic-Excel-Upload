import express from 'express'
import exphbs from 'express-handlebars'

const app = express();

// setting the static folder (public), all css and frontend js go here
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// Handlebars Setting
app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index'
}));

// Listening to port
const port = 4000;
app.listen(port, () => {
    console.log(`App is running in port ${port}`);
});

// Landing Page
app.get('/', (req, res) => {
    res.send("Hello world");
});
