var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var PORT = 8080;
var getmarkers = require('./routes/getmarkers');


var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',getmarkers);

app.listen(PORT,() => console.log(`server listening to port: ${PORT}`));
module.exports = app;
