var mongoose    = require("mongoose");
var passportLocalMongoose  =require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
     username: String,
     password: String,
     email : Array,
     number : Number,
     address : String,
     date : Date ,
     description: {type: String, possibleValues: ['male','female']}
});
UserSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",UserSchema);
