const express =require("express");
const router =express.Router();

const wrapAsync =require("../utils/wrapAsync.js");
const {listingSchema} =require("../schema.js");

const ExpressError =require("../utils/ExpressError");
const Listing =require("../models/listing.js");

const {isLoggedIn} = require("../loginMiddleware.js");
const validateListing =(req,res,next)=>{
    let{error} = listingSchema.validate(req.body);

    if(error){ 
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Home route
router.get("/",wrapAsync(async (req,res)=>{
    let allLists = await Listing.find({});
    res.render("listings/allLists",{allLists});

    

}));
//new route
router.get('/new',isLoggedIn,(req,res)=>{
   
    res.render("listings/new.ejs");
})

//create route
 

router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{

    let result= listingSchema.validate(req.body);
    console.log(result);
    if(res.error){
         throw new ExpressError(400,result.error);
    }
    let list =  req.body.listing;
    const newList = new Listing(list);
    newList.owner=req.user._id;
    await newList.save ();

    req.flash("success","new listing created");
    
    res.redirect("/listings");
   
}));


//show route

router.get("/:id", wrapAsync(async(req,res)=>{
    
    let {id}=req.params;
    const list= await Listing.findById(id).populate("reviews").populate("owner");
    if(!list){
        req.flash("error","requested listing doesnot exist");
        res.redirect("/listings");
    }
    console.log(list);
    res.render("listings/list.ejs",{list});
}))

//edit page
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash("error","requested listing doesnot exist");
        res.redirect("/listings");
    }
    console.log(list);
    res.render("listings/edit.ejs",{list});
}))

//update route
router.patch("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
   
    let {id} =req.params;
    let updated = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
    
}));

//delete route

router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
    
}))



module.exports =router;