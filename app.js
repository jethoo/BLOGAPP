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

//Set our views directory
app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

//use is a middleware , which helps to make static resources such as
//assets files, css files into dynamic files, which means 
//accessible from the server
app.use('/css', express.static('assets/css'));
app.use('/javascript', express.static('assets/javascript'));
app.use('/images', express.static('assets/images'));

//Mongo access
const mongoose = require('mongoose'); 
mongoose.connect(process.env.DB_URI, {
    auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.error(`Error: ${err}`));

// Implement Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Our routes
const routes = require('./routes.js');
app.use('/', routes);

//Start our server
app.listen(process.env.PORT || 3000, port => console.log(`Listening on port ${port}`));


