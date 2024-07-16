const express =require("express");
const router =express.Router({mergeParams:true});

const Listing =require("../models/listing.js");
const wrapAsync =require("../utils/wrapAsync.js");

const Review =require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../Middleware.js")
const ExpressError =require("../utils/ExpressError.js");
const reviewController = require("../controllers/reviews.js");


//reviews post route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview ));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));


module.exports = router;