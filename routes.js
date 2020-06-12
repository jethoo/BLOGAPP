const router = require('express').Router();


//Our resource routes
(require('./routes/pages'))(router);

module.exports = router ;