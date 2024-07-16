const express =require("express");
const router =express.Router();

const {listingSchema} =require("../schema.js");
const wrapAsync =require("../utils/wrapAsync.js");

const Listing =require("../models/listing.js");

const {isLoggedIn, isOwner, validateListing} = require("../Middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//new route 
router.get('/new',isLoggedIn,listingController.renderNewForm)

//show route
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.patch(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing ))



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))



module.exports =router;