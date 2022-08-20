const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("./models/userModel");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

//userModel.authenticate() is provided by localPassportMongoose, bc we used it as a plugin
//authenticate is deprecated, using createStrategy() instead
//otherwise, we'd have to provide a user-defined authentication function (would've'd to do it manually)

exports.local = passport.use(new LocalStrategy(userModel.authenticate()));

//to handle sessions with passport
//these are provided by passportLocalMongoose as well i.e., userModel.serializeUser() & vice versa
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


//things for JSON WEB TOKENS here
exports.getToken = (userId) => {
    return jwt.sign(userId, "my secret key", { expiresIn: 3600 });
}

//options on how a token should be extracted
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = "my secret key";

//takes options and authentication function
exports.jwtPassport = passport.use(new JwtStrategy(options, async(jwt_payload, done) => {
    console.log("JSON TOKEN PAYLOAD: ", jwt_payload);
    try {
        var user = await userModel.findOne({ _id: jwt_payload._id });
    }
    catch (error) {
        return done(error, false);
    }
    if (user) done(null, user);
    //no error but user doesn't exist
    else done(null, false);
}));

exports.verifyUser = passport.authenticate("jwt", { session: false });