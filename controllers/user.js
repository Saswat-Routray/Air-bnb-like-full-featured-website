const User=require("../models/user.js")
const {savedRedirectUrl} = require("../Middleware.js");

module.exports.renderSignUpPage = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signUp = async(req, res)=>{
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
    
}

module.exports.renderLoginPage =(req,res)=>{
    res.render("users/login.ejs");
}


module.exports.logIn = async(req,res)=>{
    req.flash("success","welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl)
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out!");
        res.redirect("/listings");
    });
}