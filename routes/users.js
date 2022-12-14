const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const userModel = require("../models/userModel");
const passport = require("passport");
const authenticate = require("../authenticate");

router.use(bodyParser.json());

router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  async (req, res, next) => {
    try {
      const users = await userModel.find({});
      console.log(users);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/signup", async (req, res, next) => {
  userModel.register(
    { username: req.body.username },
    req.body.password,
    (error, user) => {
      if (error) {
        // console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ error_message: error });
      } else {
        //we don't need to authenticate the same user but might as well, EXTRA SECURITY ;)
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            message: "Registration successful ;)",
            userCreated: user,
          });
        });
      }
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    const token = authenticate.getToken({ _id: req.user._id });
    console.log("This is token information: ", token);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      message: "You are authenticated ;) Continue using the API~",
      token: token,
    });
  }
);

router.get("/logout", (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  } else {
    let error = new Error("You aren't logged in!");
    error.status = 403;
    next(error);
  }
});

router.all("*", (req, res, next) => {
  return next(new Error("Route doesn't exist"));
});

module.exports = router;
