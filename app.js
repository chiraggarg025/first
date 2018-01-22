var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    flash           = require("flash"),
    Comment         = require("./models/comment.js"),
    User            = require("./models/user.js"),
    Feed            = require("./models/feed.js"),
    mongoose        = require("mongoose");


//requiring route

mongoose.connect("mongodb://localhost/swoosh");
app.set("view engine","ejs");
app.use(express.static("public"));
// app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(flash());
app.use(require("express-session")({
     secret: "Rusty is the best and cutest dog in the world",
     resave: false,
     saveUninitialized: false
 }));



//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes

//------------------------Landing Page------------------------------------->
app.get("/",function (req,res) {

      res.render("landing");
  });
//------------------------SignUp Page--------------------------------------->
 app.get("/signup",function (req,res) {
     res.render("signup");
 });

 app.post("/signup",function (req,res) {

     User.register(new User({username :req.body.username, email:req.body.email}),req.body.password,function(err,user){
         if(err){
             console.log(err);
              res.render("/signup");
         }else{
             res.redirect("/feed");
         }
     });



 });
//---------------------------Login Page----------------------------------------->

app.get("/login",function(req,res){
    res.render("login");
});

app.post('/login',
    passport.authenticate('local', { successRedirect: '/feed',
        failureRedirect: '/login'}),
    function(req, res){
    }
);

//-------------------------------Logout------------------------------------------->
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
//--------------------------------About Page-------------------------------------->
app.get("/about",function(req,res){
    res.send("This will be the about page");
});

//---------------------------------Feed Page--------------------------------------->
app.get("/feed",function(req,res){
     Feed.find({},function(err,feeds){
         if(err){
             console.log(err);
         }else{
            res.render("feed",{feeds:feeds});
         }
     });

});
//-----------------------------------New Profie---------------------------------------->
app.get("/feed/newprofile",function(req,res){
   res.render("newProfile") ;
});
app.post("/feed",function (req,res) {
    Feed.create(req.body.feed,function (err,newFeed) {
      if(err){
          console.log(err);
      }  else{
          res.redirect("/feed");
      }
    })
});
//----------------------------Comments--------------------------
// Comment.create({
//     author:"Ramu KAKA",
//     text:"By focusing on algooorithm"
// },function(err,comment){
//     if(err){
//         console.log(err);
//
//     }else{
//         Feed.findOne({username : "Kristy"},function(err, foundUser){
//             if(err){
//                 console.log(err);
//           }else{
//                 foundUser.comments.push(comment);
//                 foundUser.save(function (err,data) {
//                     if(err){
//                         console.log(err);
//                     }else{
//                         console.log(data);
//                     }
//                 });
//             }
//         });
//     }
// });
//
//

// var commentSchema = new mongoose.Schema({
//     text : String,
//     author : String
// });
// var Test = mongoose.model("Test",commentSchema);
// Test.create({
//     text :"this looks like s,s,OsMG",
//     author:"Rohisssst"
// },function (err,create) {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(create);
//     }
// });
//---------------------------------profile----------------------------------------------->
app.get("/feed/:id",function(req,res){

        Feed.findById(req.params.id).populate("comments").exec(function(err,foundFeed){
         if(err){
             res.redirect("/feed");
         }   else{
             console.log(foundFeed);
             res.render("profile",{feed:foundFeed});
         }
        });

});
//----------------------------------Edit Profile---------------------------------------->
 app.get("/feed/:id/edit",function(req,res){
     Feed.findById(req.params.id,function(err,foundFeed){
         if(err){
             console.log(err)
         }else{
             res.render("edit",{feed:foundFeed})
         }
     });
 });
 //Update route
 app.put("/feed/:id",function (req,res) {
    Feed.findByIdAndUpdate(req.params.id, req.body.feed ,function (err,updated) {
       if(err){
           res.redirect("/feed");
       } else{
           res.redirect("/feed/" + req.params.id);
       }
    });
 });
//------------------------------------------Delete Profile Route--------------------------
app.delete("/feed/:id",function (req,res) {
   Feed.findByIdAndRemove(req.params.id,function (err) {
       if(err){
           res.redirect("/feed");
       }else{
           res.redirect("/feed")
       }
   }) ;
});

//----------------------------------------Add NEW Comment-------------------------------------->
app.get("/feed/:id/comment/new",function (req,res) {
   Feed.findById(req.params.id,function (err,foundUser) {
       if(err){
           console.log(err);
       }else{
           res.render("comment",{feed:foundUser});
       }
   })
});
app.post("/feed/:id/comment",function (req,res) {
    Comment.create(req.body.comment,function(err,comment){
    if(err){
        console.log(err);

    }else{
        Feed.findById(req.params.id,function(err, foundUser){
            if(err){
                console.log(err);
          }else{
                foundUser.comments.push(comment._id);
                foundUser.save(function (err,data) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log(data);
                        res.redirect("/feed");
                    }
                });
            }
        });
    }
});
});



  app.listen(process.env.PORT || 5000,function () {
      console.log("Server Started !")
  });


