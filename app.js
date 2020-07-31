//to run app.js file from terminal, package.json file is updated
//by using nodemon app.js , for dev script
//therefore can be run by using, npm run dev ,
//command
//IN SQL, we have rows in our table
//In mongo, we have documents in our collection

/*
    1. npm init -y //command to install package.json ,in any project
    2. npm install express , to install express in your project
*/
//require express and save the reference in express constant
const express = require('express');
//initiate express apps and store that in app reference constant
const app = express();
//dotenv library is used, to hide the password of database !! To improve security
//password is hidden as environment variable and is accessed through .env file
require('dotenv').config();
//require path for view
const path = require('path');

//Mongo access
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
    auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(err => console.error(`Error: ${err}`));

// Implement Body Parser
//With the help of body parser, post requests to model is converted to json format
//therefore without bodyparser installed and implemented, we cannot exchange information with the database model
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Setup our session
//passport should be required before session
const passport = require('passport');
const session = require('express-session');
app.use(session({
    secret: 'any salty secret here',
    resave: true,
    saveUninitialized: false
}));

//Setting up Passport:
app.use(passport.initialize());
app.use(passport.session());
const User = require(`./models/user`);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Set our views directory
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//use is a middleware , which helps to make static resources such as
//assets files, css files into dynamic files, which means
//accessible from the server
app.use('/css', express.static('assets/css'));
app.use('/javascript', express.static('assets/javascript'));
app.use('/images', express.static('assets/images'));


//setup flash notification
const flash = require('connect-flash');
app.use(flash());
app.use('/',(req,res,next) => {

    //Setting default locals
    res.locals.pageTitle = "Untitled";
    //storing locally, "locals.flash" is going to be the local variable that will store response from flash
    res.locals.flash = req.flash();
    console.log(req.session.formData);
    res.locals.formData = req.session.formData || {};
    //after session formData is assigned to res.locals.formData
    //we have clear the res.locals.formData as follows
    req.session.formData = {};

    //Authentication helper to help restrict views depending upon authorized and unauthorized user
    res.locals.authorized = req.isAuthenticated();
    if (res.locals.authorized) res.locals.email = req.session.passport.user;
    next();
});


//Our routes
const routes = require('./routes.js');
const { appendFileSync } = require('fs');
app.use('/api', routes);

app.get('/test', (req,res) => {
    res.status(200).json({
        message: 'Hello World'
    });
});

//create new middleware for directing the traffic from front end to backend
//__dirname , means the current directory we are in
const clientRoot = path.join(__dirname, '/client/build');
app.use((req,res,next)=> {
    if (req.method === 'GET' && req.accepts('html') && !req.is('json') && !req.path.includes('.')){
        //clientRoot is the variable
        res.sendFile('index.html', { clientRoot });
    } else next(); 
});

//Start our server
//Now in development, we are sending and receiving traffic between front and back end from port 4000
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));


//NOTE: For adding authentication in the front end side, we are going to use JWT Tokens
//Step 1: Install , npm install passport-jwt and also install, npm install jsonwebtoken
