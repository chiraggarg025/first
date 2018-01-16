var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    flash           = require("flash")
    User            = require("./models/user.js"),
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
//Landing
app.get("/",function (req,res) {

      res.render("landing");
  });
//SignUp
 app.get("/signup",function (req,res) {
     res.render("signup");
 });

 app.post("/signup",function (req,res) {

     req.body.username;
     req.body.email;
     req.body.password;
     req.body.number;
     req.body.address;
     req.body.date;
     req.body.description;
     User.register(new User({username :req.body.username, email:req.body.email,
                             number: req.body.number, address:req.body.address,
                             date: req.body.date, gender:req.body.description}),req.body.password,function(err,user){
         if(err){
             console.log(err);

         }else{
             res.redirect("/signup");
         }
     });



 });
//Login

app.get("/login",function(req,res){
    res.render("login");
});

app.post('/login',
    passport.authenticate('local', { successRedirect: '/feed',
        failureRedirect: '/login'}),
    function(req, res){
    }
);

//Logout
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
//About
app.get("/about",function(req,res){
    res.send("This will be the about page");
});

//Feed
app.get("/feed",function(req,res){
    res.render("feed");
});


  app.listen(process.env.PORT || 4000,function () {
      console.log("Server Started !")
  });


