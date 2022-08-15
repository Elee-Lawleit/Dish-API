const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("./models/userModel");

//userModel.authenticate() is provided by localPassportMongoose, bc we used it as a plugin
//authenticate is deprecated, using createStrategy() instead
//otherwise, we'd have to provide a user-defined authentication function (would've'd to do it manually)

exports.local = passport.use(new LocalStrategy(userModel.authenticate()));

//to handle sessions with passport
//these are provided by passportLocalMongoose as well i.e., userModel.serializeUser() & vice versa
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());