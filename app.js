if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


const express =require('express');
const app = express();

const path =require('path');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 

const mongoose =require("mongoose");


const uri = process.env.CLOUD_URL;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
  });



const methodOverride =require("method-override");
app.use(methodOverride("_method"));


const { log } = require('console');

const ejsMate= require('ejs-mate');
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"public")));


const ExpressError =require("./utils/ExpressError");



const listingRouter =require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash =require("connect-flash");

const passport =require("passport");
const LocalStratergy =require("passport-local");
const User = require("./models/user.js");

const store=MongoStore.create({
  mongoUrl: uri,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",()=>{
  console.log("Error in mongo session store",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};
// app.get("/",(req,res)=>{
//     res.send("working");
// });


app.use(session(sessionOptions));
app.use(flash());  

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/testListing",async(req,res)=>{

//     let newList = new Listing({
//         title:"New modern architectural villa",
//         description :"By the mountain side",
//         // image :
//         price :1200000,
//         location : "lanten , switzerLand",
//         country: "SWitzerland"
//     });

//     await newList.save();
//     res.send("uploaded");

// })
 
app.use((req,res,next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error  = req.flash("error");
    res.locals.currUsr = req.user ;
    next();
}) 

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
 


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
}) 

app.use((err,req,res,next)=>{
    // console.error(err); 
    let {status=500,message="Something went wrong! "}=err;
    // res.status(status).send(message);  
    res.render("./error/error.ejs",{status : status, message:message})
})

app.listen(8080,()=>{
    console.log("server is listening");
})






