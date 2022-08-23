const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // don't need username and password bc they will be added by passport local mongoose automatically

    /* username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    */
   firstname: {
    type: String,
    default: ''
   },
   lastname: {
    type: String,
    default: ''
   },
    admin: {
        type: Boolean,
        default: false
    }
});

//this will add username and password fields as required
userSchema.plugin(passportLocalMongoose);


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;