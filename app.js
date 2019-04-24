var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var utils = require('./utils/utils');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();
mongoose.connect('mongodb://localhost:27017/call_center_log', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
  if (err) console.log('could not connect to mongodb');
});

app.use(function (req, res, next) {
  // res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST");
  res.header("Access-Control-Allow-Headers", "*, token, Content-Type");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  utils.sendErrorMessage(res, 'route not found!');
});

module.exports = app;
