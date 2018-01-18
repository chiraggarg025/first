var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var commentSchema = mongoose.Schema({
       text : String,
       author : String
});

commentSchema.plugin(passportLocalMongoose);
 module.exports = mongoose.model("Comment",commentSchema);