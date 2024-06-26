const express =require("express");
const router =express.Router({mergeParams: true});
const User=require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../loginMiddleware.js");

//signup page

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","welcome to Wanderlust!");
        res.redirect("/listings");
    })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}));


//login page

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),async(req,res)=>{
    req.flash("success","welcome back to wWnderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(res.locals.redirectUrl);
})


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out!");
        res.redirect("/listings");
    });
})
module.exports = router ;