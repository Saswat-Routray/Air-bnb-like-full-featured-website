const express =require("express");
const router =express.Router({mergeParams: true});
const User=require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../Middleware.js");
const userController = require("../controllers/user.js");

//signup page
router.route("/signup")
.get(userController.renderSignUpPage)
.post(wrapAsync(userController.signUp));


//login page
router.route("/login")
.get(userController.renderLoginPage)
.post(savedRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),userController.logIn)


router.get("/logout",userController.logOut)
module.exports = router;