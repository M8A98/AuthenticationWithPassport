var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
   username: String,
   pasword:String
});

UserSchema.plugin(passportLocalMongoose); //This takes care of the password.

module.exports = mongoose.model("User",UserSchema);