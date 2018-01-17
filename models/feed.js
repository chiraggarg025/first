var mongoose = require("mongoose");
var passportLocalMongoose  =require("passport-local-mongoose");

var FeedSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : {type: Date, default:Date.now }
});
FeedSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("Feed",FeedSchema);