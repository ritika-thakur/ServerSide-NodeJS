var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var config = require('./config');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRoute = require('./routes/leaderRoute');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});


connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => {
  console.log(err);
});


var app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
//app.use(cookieParser('12345-67890-09876-54321'));



app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRoute);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, function () {
  console.log("Server started successfully.");
});

module.exports = app;
