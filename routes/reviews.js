const express =require("express");
const router =express.Router({mergeParams:true});

const Listing =require("../models/listing.js");
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError");
const { reviewSchema} =require("../schema.js");
const Review =require("../models/review.js");



const validateReview = (req,res,next)=>{
    let {err} = reviewSchema.validate(req.body.review);
    if(err){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

//reviews post route

router.post("/",validateReview,wrapAsync( async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let {id}=req.params;
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","review added");
    res.redirect(`/listings/${id}`);
    
}));

//review delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
   let {id,reviewId}=req.params;

   await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","review deleted");
   res.redirect(`/listings/${id}`);
}));


module.exports = router;