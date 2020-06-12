/*
    1. npm init -y //command to install package.json ,in any project
    2. npm install express , to install express in your project
*/
//require express and save the reference in express constant
const express = require('express');
//initiate express apps and store that in app reference constant
const app = express();
//require path for view
const path = require('path');

//Set our views directory
app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

//Our routes
const routes = require('./routes.js');
app.use('/', routes);

//Start our server
app.listen(process.env.PORT || 3000, port => console.log(`Listening on port ${port}`));


