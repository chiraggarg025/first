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
//mongodb://localhost/swoosh
//mongodb://chanakya:asdfghjkl@ds259117.mlab.com:59117/swoosh
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
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
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
              res.render("signup");
         }else{
             passport.authenticate("local")(req,res,function(){
                 res.redirect("/feed");
             });

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
    res.render("about");
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
app.get("/feed/newprofile",isLoggedIn,function(req,res){
   res.render("newProfile") ;
});

app.post("/feed",function (req,res) {
    var author = {
        id : req.user._id,
        username: req.user.username
    };
    Feed.create({username :req.body.username,image:req.body.image,description:req.body.description,age:req.body.age,address:req.body.address,gender:req.body.gender,author:author},function (err,newFeed) {
      if(err){
          console.log(err);
      }  else{
          res.redirect("/feed");
      }
    })
});
//---------------------------------profile----------------------------------------------->
app.get("/feed/:id",function(req,res){

        Feed.findById(req.params.id).populate("comments").exec(function(err,foundFeed){
         if(err){
             res.redirect("/feed");
         }   else{
             res.render("profile",{feed:foundFeed});
         }
        });

});
//----------------------------------Edit Profile---------------------------------------->
 app.get("/feed/:id/edit",checkOwnership,function(req,res){

         Feed.findById(req.params.id,function(err,foundFeed){
             if(err){
                 res.redirect("/feed")
             }else{
                     res.render("edit",{feed:foundFeed})
                 }
         });
     }

 );
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
app.delete("/feed/:id", checkOwnership,function (req,res) {
   Feed.findByIdAndRemove(req.params.id,function (err,found) {
       if(err){
           res.redirect("/feed");
       }else{
           res.redirect("/feed")
       }
   }) ;
});

//----------------------------------------Add NEW Comment-------------------------------------->
app.get("/feed/:id/comment/new",isLoggedIn,function (req,res) {
   Feed.findById(req.params.id,function (err,foundUser) {
       if(err){
           console.log(err);
       }else{
           res.render("comment",{feed:foundUser});
       }
   })
});
app.post("/feed/:id/comment",isLoggedIn,function (req,res) {
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
                        res.redirect("/feed");
                    }
                });
            }
        });
    }
});
});
//---------------------------------MIDDLEWARE------------------------>
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");

}

function checkOwnership(req ,res ,next) {
    if(req.isAuthenticated()){
        Feed.findById(req.params.id,function (err,found) {
            if(err){
                res.redirect("back");
            }else{
                if(found.author.id.equals(req.user._id)){
                   return next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.send("You don't have permissions to do that");
    }
}

  app.listen(process.env.PORT || 4000,function () {
      console.log("Server Started !")
  });


