const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const userModel = require("../models/userModel");

router.use(bodyParser.json());


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next) => {
  userModel.findOne({ username: req.body.username })
    .then((user) => {
      if (user !== null) {
        let error = new Error(`User ${req.body.username} alerady exists`);
        error.status = 403;
        next(error);
      }
      else {
        return userModel.create({ username: req.body.username, password: req.body.password });
      }
    })
    .then((user) => {
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "User created!", user: user });
    })
    .catch((error) => next(error));
});

router.post("/login", (req, res, next) => {

  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      res.setHeader("www-authenticate", "Basic");
      let error = new Error("You are not authenticated");
      error.status = 401;
      return next(error);
    }

    let auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");

    let username = auth[0];
    let password = auth[1];

    userModel.findOne({ username: username })
      .then((user) => {
        if (user === null) {
          let error = new Error(`User with alias ${username} does not exist!`);
          error.status = 403;
          return next(error);
        }
        else if (user.password !== password) {
          let error = new Error("Wong password!");
          error.status = 403;
          return next(error);
        }
        //I know, VERY HARD AND TOUGH CHECKS RIGHT, I KNOW
        //YOU DON'T HAVE TO TELL ME, I KNOW
        else if (user.username === username && user.password === password) {
          req.session.user = "authenticated";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You are authenticated ;) Please continue using the API~");
        }
      })
      .catch((error) => next(error));
  }
  else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are aleady authenticated!");
  }
});

router.get("/logout", (req, res, next)=>{
  if(req.session.user){
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  }
  else{
    let error = new Error("You aren't logged in!");
    error.status = 403;
    next(error);
  }
});

router.all("*", (req, res, next)=>{
  return next(new Error("Route doesn't exist"));
})

module.exports = router;
