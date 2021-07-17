var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');
var validator = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config()

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var userRoutes = require('./routes/user');


var app = express();

// Connect to db
mongoose.connect('mongodb://localhost:27017/shopcart', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret-and-secret-key',
  resave: false,
  saveUnintialized: false,
  store: MongoStore.create({ mongoUrl:'mongodb://localhost:27017/shopcart' }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/user',userRoutes);
app.use('/admin', adminRouter);

//console.log(process.env.SECRET_KEY);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
