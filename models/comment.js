var mongoose = require("mongoose");
var passportLocalMongoose  =require("passport-local-mongoose");

var commentSchema = new mongoose.Schema({
    text : String,
    author : String
});
module.exports = mongoose.model("Comment",commentSchema);