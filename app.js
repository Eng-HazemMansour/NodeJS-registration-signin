require("dotenv").config();
const express = require('express');
const app = express();
const userRouter = require("./api/users/user.router");
const passport = require('passport');
const initPassportLocal = require('./contollers/passportLocalController');
const connectFlash = require('connect-flash');
const session = require('express-session');
const cookieSession = require('cookie-session');
require('./passport-google');


initPassportLocal();

app.use(cookieSession({
    name : 'session',
    keys : ['key1','key2']
}))

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:false,
    cookie: { maxAge: 60000 }
}))
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get("/", (req, res)=>{
    res.render('index.ejs', {
        user : req.user
    });
});

app.get("/login", (req, res)=>{
    res.render('login.ejs', {
        errors: req.flash("errors")
    });
});

app.get("/register", (req, res)=>{
    res.render('register.ejs')
});

app.post("/login", passport.authenticate("local", {
    successRedirect : '/',
    failureRedirect : '/login',
    successFlash : true,
    failureFlash : true
}));

app.get('/failed', (req, res)=>res.send("Google sign in failed"))
app.get('/success', (req, res)=>res.send(`Google sign in succeeded Mr. ${req.user.email}`))

app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/success');
  });

app.use("/auth", require('./routes/auth'));

app.use(express.json())
app.use("/api/users", userRouter);
app.listen(process.env.APP_PORT, ()=>{
    console.log("Server running on port:", process.env.APP_PORT)
});