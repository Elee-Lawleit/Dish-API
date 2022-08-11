const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require("./routes/dishRouter")
const promoRouter = require("./routes/promoRouter")
const leaderRouter = require("./routes/leaderRouter")

const mongoose = require("mongoose");
const dishModel = require("./models/dishesModel");
const url = "mongodb://localhost:27017/SampleDatabase";

const connection = mongoose.connect(url);

connection.then((db) => {
  console.log("Connected to database successfully");
}).catch((error) => {
  console.error(error);
})

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Sample Cookie Parser Key"));

const auth = (req, res, next) => {
  console.log(req.signedCookies);

  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      res.setHeader("www-authenticate", "Basic");
      let error = new Error("You are not authenticated");
      error.status = 401;
      return next(error);
    }

    let auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");

    let username = auth[0];
    let password = auth[1];

    //only for demonstration purpose
    if (username === "admin" && password === "password") {
      //will send the cookie back the client side
      res.cookie("user", "admin", {signed: true});
      next();
    }
    else {
      res.setHeader("www-authenticate", "Basic");
      let error = new Error("You are not authenticated");
      error.status = 401;
      return next(error);
    }
  }
  else {
    if(req.signedCookies.user === "admin"){
      next();
    }
    else{
      let error = new Error("You are not authenticated!");
      error.status = 401;
      return next(error);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

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

module.exports = app;
