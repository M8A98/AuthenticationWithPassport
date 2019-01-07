var express               = require("express");
var mongoose              = require("mongoose");
var passport              = require("passport");
var bodyParser            = require("body-parser");
var LocalStrategy         = require("passport-local");
var User                  = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo_app", {useNewUrlParser: true});
//var app = express(); not needed because of the next lines.
var app = express();

app.use(require("express-session")({
    secret: "Rusty",
    resave:false,
    saveUninitialized:false
}));


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========
//ROUTES
//========


app.get("/",function(req,res){
   res.render("home"); 
});

app.get("/secret",isLoggedIn,function(req,res){
   res.render("secret"); 
});

//========
//AUTH ROUTES
//========

//handling user sign up
app.post("/register",function(req,res){
   req.body.username;
   req.body.password;
   User.register(new User({username:req.body.username}),req.body.password,function(err,user){
       if (err) {
           return res.render("register");//A return is included because that way you can omit the else.Remember that you are within a function.
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/secret");
       })
   })
});

//show sign up form
app.get("/register",function(req, res) {
   res.render("register"); 
});

//Log in routes
//render login forms
app.get("/login",function(req, res) {
    res.render("login");
});
//login logic
//Middleware is code that runs before our final callback
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){
    
});

//logout

app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started !");
});