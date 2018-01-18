var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
var Post = mongoose.model("Post",postSchema);
var userSchema = new mongoose.Schema({
    name : String,
    email: String,
    posts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }]
},{ usePushEach: true });
var User = mongoose.model("User",userSchema);

// User.create({
//     name:"Chanakya",
//     email :"coder123@gmail.com"
//
// },function(err , user){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(user);
//     }
// });
Post.create({
    title:"How to learn coding 3 part",
    content:"By focusing on algorithm"
},function(err,post){
    if(err){
        console.log(err);

    }else{
        User.findOne({name : "Chanakya"},function(err, foundUser){
            if(err){
                console.log(err);
            }else{
                foundUser.posts.push(post._id);
                foundUser.save(function (err,data) {
                    if(err){
                        console.log(err);
                    }else{
                       console.log(data);
                    }
                });
            }
        });
    }
});

